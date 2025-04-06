const { MongoClient } = require('mongodb');

class MongoUtils {
    static async insert(MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION, doc) {
        const client = new MongoClient(MONGO_URI, {
            tlsAllowInvalidCertificates: true
        });
        
        try {
            await client.connect();
            const db = client.db(MONGO_DB_NAME);
            const collection = db.collection(MONGO_COLLECTION);
            const result = await collection.insertOne(doc);
            const docId = result.insertedId;
            return docId;
        } catch (error) {
            throw new Error(`Error inserting document: ${error.message}`);
        } finally {
            await client.close();
        }
    }

    static async count(MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION, filter) {
        const client = new MongoClient(MONGO_URI, {
            tlsAllowInvalidCertificates: true
        });
        
        try {
            await client.connect();
            const db = client.db(MONGO_DB_NAME);
            const collection = db.collection(MONGO_COLLECTION);
            const count = await collection.countDocuments(filter);
            return count;
        } catch (error) {
            throw new Error(`Error counting documents: ${error.message}`);
        } finally {
            await client.close();
        }
    }

    static async get(
        MONGO_URI,
        MONGO_DB_NAME,
        MONGO_COLLECTION,
        filter,
        sort = null,
        skip = null,
        limit = null,
        projection = null
    ) {
        const client = new MongoClient(MONGO_URI);
        
        try {
            await client.connect();
            const db = client.db(MONGO_DB_NAME);
            const collection = db.collection(MONGO_COLLECTION);
            
            let query = collection.find(filter, projection);
            
            if (sort) query = query.sort(sort);
            if (skip) query = query.skip(skip);
            if (limit) query = query.limit(limit);
            
            const documents = await query.toArray();
            
            // Remove _id field from each document
            return documents.map(doc => {
                const { _id, ...rest } = doc;
                return rest;
            });
        } catch (error) {
            throw new Error(`Error getting documents: ${error.message}`);
        } finally {
            await client.close();
        }
    }

    static async updateOne(MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION, filter, update_data, upsert = false) {
        const client = new MongoClient(MONGO_URI);
        
        try {
            await client.connect();
            const db = client.db(MONGO_DB_NAME);
            const collection = db.collection(MONGO_COLLECTION);
            await collection.updateOne(filter, update_data, { upsert });
            return true;
        } catch (error) {
            throw new Error(`Error updating document: ${error.message}`);
        } finally {
            await client.close();
        }
    }

    static async updateMany(MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION, filter, update_data, upsert = false) {
        const client = new MongoClient(MONGO_URI);
        
        try {
            await client.connect();
            const db = client.db(MONGO_DB_NAME);
            const collection = db.collection(MONGO_COLLECTION);
            await collection.updateMany(filter, update_data, { upsert });
            return true;
        } catch (error) {
            throw new Error(`Error updating documents: ${error.message}`);
        } finally {
            await client.close();
        }
    }

    static async deleteOne(MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION, filter) {
        const client = new MongoClient(MONGO_URI);
        
        try {
            await client.connect();
            const db = client.db(MONGO_DB_NAME);
            const collection = db.collection(MONGO_COLLECTION);
            
            // Check if document exists
            const document = await collection.findOne(filter);
            if (!document) {
                throw new Error('Document not found');
            }
            
            await collection.deleteOne(filter);
            return true;
        } catch (error) {
            throw new Error(`Error deleting document: ${error.message}`);
        } finally {
            await client.close();
        }
    }

    static async deleteMany(MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION, filter) {
        const client = new MongoClient(MONGO_URI);
        
        try {
            await client.connect();
            const db = client.db(MONGO_DB_NAME);
            const collection = db.collection(MONGO_COLLECTION);
            await collection.deleteMany(filter);
            return true;
        } catch (error) {
            throw new Error(`Error deleting documents: ${error.message}`);
        } finally {
            await client.close();
        }
    }

    static async aggregate(MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION, pipeline) {
        const client = new MongoClient(MONGO_URI);
        
        try {
            await client.connect();
            const db = client.db(MONGO_DB_NAME);
            const collection = db.collection(MONGO_COLLECTION);
            const results = await collection.aggregate(pipeline).toArray();
            return results;
        } catch (error) {
            throw new Error(`Error performing aggregation: ${error.message}`);
        } finally {
            await client.close();
        }
    }
}

module.exports = MongoUtils; 