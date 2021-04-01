import { $helper } from "@jx3box/jx3box-common/js/https.js";

const qs = require("qs");

function get_legal_tags() {
    return $helper()({
        method: "GET",
        url: `/api/post/collection/legal_tags`,
    });
}

function get_collection(collection_id) {
    return $helper()({
        method: "GET",
        url: `/api/post/collection/${collection_id}`,
    });
}

function get_my_collections(params) {
    return $helper()({
        method: "GET",
        url: `/api/my/post/collections`,
        params: params,
    });
}

function submit_collection(collection) {
    return $helper()({
        method: "POST",
        url: `/api/post/collection`,
        data: qs.stringify({
            action: collection.id ? "update" : "create",
            collection: collection,
        }),
    });
}

function remove_collection(collection_id) {
    if (collection_id) {
        return $helper()({
            method: "PUT",
            url: `/api/post/collection/remove`,
            data: qs.stringify({ id: collection_id }),
        });
    } else return null;
}

export {
    get_legal_tags,
    get_collection,
    get_my_collections,
    submit_collection,
    remove_collection,
};
