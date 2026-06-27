import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

/* ✅ FIXED pre-save hook (Async/Await Mongoose pattern) */
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
        throw err;
    }
});

/* Compare password */
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
