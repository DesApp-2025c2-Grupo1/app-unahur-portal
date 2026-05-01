class AffiliateModel {
    constructor(reqBody) {
        this.credencial_number = ""; //Se calcula en el momento de la creacio
        this.document_number = reqBody.document_number;
        this.document_type = reqBody.document_type;
        this.birth_date = reqBody.birth_date;
        this.first_name = reqBody.first_name;
        this.last_name = reqBody.last_name;
        this.email = reqBody.email;
        this.phone = reqBody.phone;
        this.address = reqBody.address;
        this.city = reqBody.city;
        this.province = reqBody.province;
        this.postal_code = reqBody.postal_code;
        this.country = reqBody.country;
        this.plan_id = reqBody.plan_id;
        this.user_id = null;
    }
}

module.exports = AffiliateModel;