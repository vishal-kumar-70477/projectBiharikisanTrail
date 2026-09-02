const buyerModle = require("../models/buyer.model")
const sessionModel = require("../models/session.model")
const jwt = require("jsonwebtoken")
const config = require("../config/config")
const argon2 = require("argon2")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const buyerModel = require("../models/buyer.model")
const otpModel = require("../models/otp.model")
const {generateOtp,generateOtpHtml} = require("../utils/utils")
const sendEmail = require("../services/email.service")
const { log } = require("console")
const { ref } = require("process")
const { decode } = require("punycode")


// register
async function register(req,res){
    const {fullName,email,mobileNo,address,role,password} = req.body;


    const isBuyerExist = await buyerModle.findOne({
        $or:[{fullName},{mobileNo},{email}]
    })

    if(isBuyerExist){
        return res.status(409).json({
            success:false,
            message:"User already exist"
        })
    }
    
    const hashPassword = await bcrypt.hash(password,10);
    
    const buyer = await buyerModel.create({
        fullName,
        email,
        mobileNo,
        address,
         role,
        password:hashPassword,
        verified:(role == "seller" || role == "driver")?"pending":undefined,

    });
    
    const otp = String(generateOtp());
    const otpHtml = generateOtpHtml(otp)
    const otpHash = await crypto.createHash("sha256").update(otp).digest("hex")
    await otpModel.create({
         email,
         userID:buyer._id,
         otpHash
    })

    await sendEmail(email,"OTP Verification","Verify your email with given OTP",otpHtml)



    res.status(200).json({
        success:true,
        message:"User Registered Successfully",
        
    })





}


// otp verification
async function otpVerification(req,res){
    const {email,otp} = req.body;

    const otpHash = await crypto.createHash("sha256").update(otp).digest("hex");
    
    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    });

    if(!otpDoc){
        return res.status(400).json({
            success:false,
            message:"Invalid Otp"
        });

    }

    const user = await buyerModel.findByIdAndUpdate(otpDoc.userID,{
        isEmailVerified:true
    });
    

    await otpModel.deleteMany({
        email
    })
    
    // refreshToken
    const refreshToken = jwt.sign({
        id:user._id,
        role:user.role
    },config.JWT_SECRET_KEY,{
        expiresIn:"7d"
    })

    // access token
    const acessToken = jwt.sign({
        id:user._id,
        role:user.role
    },config.JWT_SECRET_KEY,{
        expiresIn:"15m"
    }) 
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7 * 24 * 60 * 60 * 1000
    });

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = sessionModel.create({
        userId:user._id,
        refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers["user-agent"]
    })

    return res.status(201).json({
        success:true,
        message:"Email verified successfully",
        

    })

}


// login
async function login(req,res){
  const {email,password} = req.body;

  const isUserExist = await buyerModel.findOne({
    email
  })

  if(!isUserExist){
    return res.status(404).json({
        success:false,
        message:"user not found"
    })
  }

  const isPasswordCorrect = await bcrypt.compare(password,isUserExist.password);

  if(!isPasswordCorrect){
    return res.status(401).json({
        success:"false",
        message:"Incorrect password"  
    }) 
  }

  // refreshToken
  const refreshToken = jwt.sign({
    id:isUserExist._id,
    role:isUserExist.role
  },config.JWT_SECRET_KEY,{
    expiresIn:"7d"
  });

  const accessToken = jwt.sign({
    id:isUserExist._id,
    role:isUserExist.role
  },config.JWT_SECRET_KEY,{
    expiresIn:"15m"
  });

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
        secure: process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge:7 * 24* 60 * 60 * 1000
  });
  const session = await sessionModel.create({
    userId:isUserExist._id,
    refreshTokenHash,
    ip:req.ip,
    userAgent:req.headers["user-agent"]
})

let dashboard;

if (isUserExist.role === "buyer") {
    dashboard = "/buyerDash";
} 
else if (isUserExist.role === "seller") {
    dashboard = "/dash/register/farmerDash";
} 
else if (isUserExist.role === "driver") {
    dashboard = "/dash/register/driverDash";
} 
else {
    return res.status(400).json({
        success: false,
        message: "Invalid user role"
    });
}

return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    role: isUserExist.role,
    dashboard: dashboard
});



}

// logout
async function logout(req,res){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(404).json({
            success:false,
            message:"Token not found"
        })
    }
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);

    if(!decoded){
        return res.status(404).json({
            success:false,
            message:"Token is invalid"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked:false
    })

    if(!session){
        return res.status(404).json({
            success:false,
            message:"Session not found"
        })
    }
    
    session.revoked = true;
    res.clearCookie("refreshToken");
    await session.save();
    res.status(200).json({
        success:true,
        message:"Logout successfully"
    })
}










module.exports = {register,otpVerification,login,logout};