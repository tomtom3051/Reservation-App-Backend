/**
 * This function uploads images to the server.
 * @param {*} req 
 * @param {*} res 
 */
function upload(req, res) {
    if (req.file.filename) {
        res.status(201).json({
            message: 'Image upload successfull!',
            url: req.file.filename
        });
    } else {
        res.status(500).json({
            message: 'Something went wrong!'
        });
    }
}

module.exports = {
    upload: upload
}