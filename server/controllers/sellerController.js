import jwt from 'jsonwebtoken';

export const sellerToken = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({ success: true, message: 'Logged In' });
        } else {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const isSellerAuth = async (req, res) => {
    try {
        const { sellerToken } = req.cookies;

        if (!sellerToken) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
        return res.json({ success: true, user: { email: decoded.email } });

    } catch (error) {
        console.error(error.message);
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

export const sellerLogout = (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
