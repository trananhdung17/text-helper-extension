export default class OpenAITextProcessor {
    private _api_token:string;
    private _model:string;
    private _endpoint:string = 'https://api.openai.com/v1/completions';

    /**
     * 
     * @param api_token 
     * @param model 
     */
    constructor (api_token:string, model:string = "text-davinci-001") {
        this._api_token = api_token;
        this._model = model;
    }

    /**
     * 
     * @param requirement 
     * @param max_lenght 
     * @returns 
     */
    public compose (requirement:string, tone:string='solemn', max_lenght:number = 500) {
        const prompt = requirement.search('tone') && tone ? requirement : `${requirement} in the tone of ${tone}`;
        return this._call(prompt, max_lenght);
    }

    /**
     * 
     * @param text 
     * @param max_lenght 
     * @returns 
     */
    public summary (text:string, max_lenght:number = 200) {
        const prompt = `Please help to summary the text: ${text}`;
        return this._call(prompt, max_lenght);
    }

    /**
     * 
     * @param text 
     * @returns 
     */
    public paraphrase (text:string) {
        const prompt = `Please help to paraphrase the text: ${text}`;
        return this._call(prompt, text.length);
    }

    /**
     * 
     * @param text 
     * @returns 
     */
    public shorten (text:string) {
        const prompt = `Please help to shorten text for: ${text}`;
        return this._call(prompt, text.length);
    }

    /**
     * 
     * @param text 
     * @returns 
     */
    public correct (text:string) {
        const prompt = `Please help to correct grammar and spelling the text: ${text}`;
        return this._call(prompt, text.length);
    }

    /**
     * 
     * @returns string - model name
     */
    public getModel () {
        return this._model;
    }
    /**
     * 
     * @param model:string - Available models please see more on https://openai.com
     */
    public setModel (model:string) {
        this._model = model;
    }

    /**
     * 
     * @param prompt 
     * @param max_lenght 
     * @returns 
     */
    private _call (prompt:string, max_lenght:number) {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${this._api_token}`);
        myHeaders.append("Content-Type", "application/json");

        const payload:string = JSON.stringify({
            model: this._model,
            prompt: prompt,
            max_tokens: max_lenght
        });
        
        const request_options:Object = {
            method: 'POST',
            headers: myHeaders,
            body: payload,
            redirect: 'follow'
        };

        return new Promise((resolve, reject) => {
            return fetch(this._endpoint, request_options)
            .then(response => response.text())
            .then(result => {
                console.log('Received the response from OpenAI', JSON.parse(result));
                const choices = JSON.parse(result).choices;
                if (choices) {
                    console.log(result);
                    return resolve(choices[0].text)
                }
                console.log('Service not available');
                return 'NPL Service is busy now!'
            })
            .catch(error => reject(error));
        })
        
    } 
}
