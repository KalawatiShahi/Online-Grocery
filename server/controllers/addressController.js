// addressController.js
import Address from "../models/Address.js";

// ADD ADDRESS
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID not found in request" });
    }

    const {
      firstName,
      lastName,
      street,
      city,
      state,
      country,
      zipcode,
      phone,
    } = req.body.address;

    const fullName = `${firstName} ${lastName}`;

    const newAddress = new Address({
      user: userId,
      fullName,
      phone,
      street,
      city,
      state,
      country,
      zipcode,
    });

    await newAddress.save();

    res.json({ success: true, message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET USER'S ADDRESS
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID not found in request" });
    }

    const addresses = await Address.find({ user: userId });

    if (addresses.length === 0) {
      return res.status(404).json({ success: false, message: "No address found" });
    }

    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
