import datasets from '../helpers/datasets.mjs';
import cache from '../storage/cache.mjs';
import queries from '../../global/jsonata/queries.mjs';
import helpers from './helpers.mjs';

// const LOG_TAG = 'controller-core';

export default (app) => {

    // Создает ответ на JSONata запрос и при необходимости кэширует ответ
    function makeJSONataQueryResponse(res, query, params, subject) {
        cache.pullFromCache(JSON.stringify({query, params, subject}), async()=> {
            return await datasets(app).parseSource(
                app.storage.manifest,
                query,
                subject,
                params
            );
        }, res);
    }

    // Парсит переданные во внутреннем формате данные 
    function parseRequest(req) {
        return {
            query: req.params.query,
            params: req.query?.params ? JSON.parse(req.query?.params) : undefined,
            subject: req.query?.subject ? JSON.parse(req.query?.subject) : undefined,
            baseURI: req.query?.baseuri
        };
    }

    // Выполняет произвольные запросы 
    app.get('/core/storage/jsonata/:query', function(req, res) {
        if (!helpers.isServiceReady(app, res)) return;

        const request = parseRequest(req);
        const query = (request.query.length === 36) && queries.QUERIES[request.query] 
            ? `(${queries.makeQuery(queries.QUERIES[request.query], request.params)})`
            : request.query;

        makeJSONataQueryResponse(res, query, request.params, request.subject);
    });

    // Выполняет произвольные запросы 
    app.get('/core/storage/release-data-profile/:query', function(req, res) {
        if (!helpers.isServiceReady(app, res)) return;

        const request = parseRequest(req);
        cache.pullFromCache(JSON.stringify({path: request.query, params: request.params}), async()=> {
            if (request.query.startsWith('/')) 
                return await datasets(app).releaseData(request.query, request.params);
            else if (request.query.startsWith('{')) 
                return await datasets(app).getData(app.storage.manifest, JSON.parse(request.query), request.params, request.baseURI);
            else 
                throw `Error query param [${request.query}]`;
        }, res);
    });

    // Возвращает результат работы валидаторов
    app.get('/core/storage/problems/', function(req, res) {
        if (!helpers.isServiceReady(app, res)) return;
        res.json(app.storage.problems || []);
    });

    /*
    // Текущее полное состояние
    app.get('/core/manifest/state', function(req, res) {
        if (!helpers.isServiceReady(app, res)) return;

        res.json({
            manifest: app.storage.manifest,
            mergeMap: app.storage.mergeMap
        });
    });
    */
};

