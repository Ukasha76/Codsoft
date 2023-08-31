class flashError extends Error{
    constructor(message){
        super(message)
        this.flashmessages=message
    }
}
module.exports = flashError