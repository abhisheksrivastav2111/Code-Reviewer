const aiService = require("../services/ai.service.review")
const aiServiceExplain = require("../services/ai.service.codeExplain");


module.exports.getReview = async (req, res) => {

    const { code , level} = req.body;

    console.log(level);

    if (!code) {
        return res.status(400).send("Prompt is required");
    }
    const response = await aiService(code,level);
    
    res.send(response);

}

module.exports.explainCode = async(req, res) =>{
    const {code, level} = req.body;

    if(!code){
        return res.status(400).send("promt is required");

    }
    const response = await aiServiceExplain(code,level);
    res.send(response);
}