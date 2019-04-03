// JavaScript source code
conn = new Mongo();
db = conn.getDB("AnthroLinkDB");

db.createUser(
    {
        user: "AnthroAdmin",
        pwd: "password",

        roles: [{ role: "userAdmin", db: "AnthroLinkDB" }]
    }
);

db.createCollection("users");

db = conn.getDB("admin");

db.createUser(
    {
        user: "adminDB",
        pwd: "password",

        roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
    }
);





