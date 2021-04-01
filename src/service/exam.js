import {$next} from '@jx3box/jx3box-common/js/https'

function getQuestion(id, vm) {
    return $next().get("/api/question/" + id);
}

function createQuestion(data, vm) {
    return $next().post("/api/question/create", data);
}

function updateQuestion(id, data, vm) {
    return $next().put("/api/question/" + id + "/update", data);
}

function createPaper(data, vm) {
    return $next().post("/api/question/" + "exam-paper", data);
}

function updatePaper(id, data, vm) {
    return $next().put("/api/question/" + "exam-paper/" + id, data);
}

function getPaper(id, vm) {
    return $next().get("/api/question/" + "exam-paper/" + id);
}

function getQuestions(query, vm) {
    return $next().get("/api/question/" + "my-list", {
        params: query,
    });
}

function getPapers(query) {
    return $next().get("/api/question/exam-paper?my", {
        params: query,
    });
}

export {
    getQuestion,
    createQuestion,
    updateQuestion,
    getQuestions,
    createPaper,
    updatePaper,
    getPaper,
    getPapers,
};
