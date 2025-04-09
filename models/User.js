const mongoose = require("mongoose");
const {type} = require("os");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "enter email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Enter a valid email adress"]
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "minimum 6 characters!"]
    },
    role: {
        type: String,
        enum: ["user", "admin", "line1", "line2"],
        default: "user"
    }
})

userSchema.post("save", function(doc, next) {
    console.log("New user has been created:", doc);
    next();
})

userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

userSchema.statics.login = async function (email, password) {
   const user = await this.findOne({email})
   
   if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
        return user;
    }
    throw Error("Incorrect password")
   }
   throw Error("Incorrect Email")
}

const User = mongoose.model("User", userSchema);
module.exports = User;
