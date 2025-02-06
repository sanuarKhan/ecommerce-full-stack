const  fs = require('fs');
const deleteImage = async (userImagePath) => {
    try {
       await fs.access(userImagePath)
        await fs.unlink(userImagePath)
        console.log("image was deleted")
        
    } catch (error) {
        console.error("image not was deleted")
    }
    
}
module.exports = deleteImage;