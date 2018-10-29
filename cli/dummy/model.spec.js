const dotenv = require('dotenv');
const { assert } = require('chai');
const mongoose = require('mongoose');
const faker = require('faker');

dotenv.config();

require('./MODEL');

const correctTestData = {};
const wrongTestData = {};
const updataTestData = {};

describe('Check MODEL model', () => {
    before(async () => {
        try {
            mongoose.Promise = global.Promise;
            mongoose.connect(process.env.MONGO_URI);
            const drops = Object.keys(mongoose.connection.collections).map(key => mongoose.connection.collections[ key ].drop());
            await Promise.all(drops);
            assert.ok(true);
        } catch (err) {
            assert.ifError(err);
        }
    });
    it('Should fail adding test data', async () => {
        try {
            const TESTNAME = mongoose.model('MODEL');
            const NEWDATA = new TESTNAME(wrongTestData);
            await NEWDATA.save();
            assert.ok(false);
        } catch (err) {
            assert.ok(true);
        }
    });
    it('Should add test data', async () => {
        try {
            const TESTNAME = mongoose.model('MODEL');
            const NEWDATA = new TESTNAME(correctTestData);
            await NEWDATA.save();
            assert.ok(true);
        } catch (err) {
            assert.ifError(err);
        }
    });
    it('Should fetch test data', async () => {
        try {
            const TESTNAME = mongoose.model('MODEL');
            const data = await TESTNAME.findOne(correctTestData);
            assert.isNotNull(data);
            assert.property(data, '_id');
            assert.property(data, 'name');
            assert.strictEqual(data.name, correctTestData.name);
            assert.ok(true);
        } catch (err) {
            assert.ifError(err);
        }
    });
    it('Should updata data', async () => {
        try {
            const TESTNAME = mongoose.model('MODEL');
            const update = await TESTNAME.findOneAndUpdate(correctTestData, updataTestData, { new: true });
            assert.isNotNull(update);
            assert.property(update, '_id');
            assert.property(update, 'name');
            assert.strictEqual(update.name, updataTestData.name);
            assert.ok(true);
        } catch (err) {
            assert.ifError(err);
        }
    });
    it('Should remove test data', async () => {
        try {
            const TESTNAME = mongoose.model('MODEL');
            await TESTNAME.findOneAndRemove(correctTestData);
            const check = await TESTNAME.findOne(correctTestData);
            if (check !== null) {
                assert.ok(false);
            }
            assert.ok(true);
        } catch (err) {
            assert.ifError(err);
        }
    });
    after(async () => {
        await mongoose.connection.close();
        assert.ok(true);
    });
});
