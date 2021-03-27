import axios from "axios";
import { $helper, $https, $_https } from "@jx3box/jx3box-common/js/https.js";
const $http = $helper({
    proxy: true,
});
const $server = $https("server", {
    proxy: false,
});
const $_server = $_https("server", {
    proxy: false,
});
const $next = $https("next", {
    proxy: true,
    interceptor: "next",
});
const $_next = $_https("next", {
    proxy: true,
    interceptor: "next",
});
const $_pay = $_https("pay", {
    proxy: true,
    interceptor: "next",
});
export { axios, $helper, $http, $server, $next, $_server, $_next, $_pay };
