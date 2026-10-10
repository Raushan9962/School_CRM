const { getParents } = require('./controllers/teacherPortalController.js');

const req = {
    user: { schoolId: 2, id: 33 }
};
const res = {
    status: function(code) {
        this.code = code;
        return this;
    },
    json: function(data) {
        console.log("Response:", this.code, data);
    }
};

async function test() {
    await getParents(req, res);
    process.exit(0);
}
test();
