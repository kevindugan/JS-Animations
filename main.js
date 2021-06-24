"use strict";

const Hapi = require("@hapi/hapi");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const os = require("os");

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: "localhost"
    });

    server.route([
        {
            method: "GET",
            path: "/",
            handler: (request, h) => {

                return h.view("mainPage", {hostName: `${os.hostname}`});
            }
        },
        {
            method: "GET",
            path: "/fireflies",
            handler: (request, h) => {

                return h.view("fireflies", {hostName: `${os.hostname}`});
            }
        },
        {
            method: "GET",
            path: "/tree",
            handler: (request, h) => {

                return h.view("searchTree", {hostName: `${os.hostname}`});
            }
        },
        {
            method: "GET",
            path: "/css/{file}",
            handler: (request, reply) => {
                return reply.file("./css/" + request.params.file);
            }
        },
        {
            method: "GET",
            path: "/script/{file}",
            handler: (request, reply) => {
                return reply.file("./script/" + request.params.file);
            }
        }
    ]);

    await server.start();
    await server.register([Vision, Inert]);
    server.views({
        engines: {
            html: require("handlebars")
        },
        relativeTo: __dirname,
        path: "templates"
    });
    console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {

    console.log(err);
    process.exit(1);
});

init();