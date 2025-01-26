import { createApi } from "unsplash-js";
import dotenv from "dotenv";

dotenv.config();


const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    fetch: fetch,
});


export const getRandomImages = async (req, res) => {
    const { numImages } = req.body;

    if (!numImages) {
        res.status(400).json({ success: false, message: "Number of images required" });
    }

    try {
        const result = await unsplash.photos.getRandom({
            collectionIds: ["317099"],
            count: numImages
        });

        console.log(result);

        if (result && result.response) {
            const images = (result.response);
            res.status(200).json({ success: true, data: images });
        } else {
            res.status(500).json({ success: false, message: "Failed to get images from Unsplash" });
        }
    } catch (error) {
        console.log("Error fetching images", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}