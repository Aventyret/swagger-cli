require('dotenv').config()
const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

const handler = (token, rc, method, command) => (params) => {

    const { title, definition, cmd } = command
    const cmd_params = Object.keys(definition)
    params = cmd_params.reduce( (prev, curr) => {
        prev[curr] = params[curr]
        return prev
    }, {})

    const headers = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    })

    const post = (uri, data) => {
        return fetch(`${rc.api}${uri}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers()
        })
        .then(res => {
            if (!res.ok) {
                console.log(res.status)
                console.log(`${rc.api}${uri}`, data)
                if (res.status === 401) {
                    return res.text().then( (message) => Promise.reject({status: res.status, message: 'Unauthorized'}))                
                }
                const errors = JSON.parse(res.message) || res.message
                return res.text().then( (message) => Promise.reject({status: res.status, ...errors }))                                          
            } 
            return Promise.resolve(res.json());
        }) 
    }

    const put = (uri, data) => {
        return fetch(`${rc.api}${uri}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: headers()
        })
        .then(res => {
            if (!res.ok) {
                console.log(res.status)
                console.log(uri, data)
                if (res.status === 401) {
                    return res.text().then( (message) => Promise.reject({status: res.status, message: 'Unauthorized'}))                
                }
                const errors = JSON.parse(res.message) || res.message
                return res.text().then( (message) => Promise.reject({status: res.status, ...errors }))                                          
            } 
            return Promise.resolve(res.json());
        }) 
    }

    const get = (uri, params =  {}) => {
        var url = new URL(`${rc.api}${uri}`)
        url.search = new URLSearchParams(params).toString();
        const h = {
            method: 'GET',
            headers: headers()
        }
        return fetch(url, h)
        .then(res => {
            if (!res.ok) {
                console.log(res.status)
                console.log(uri, params)
                if (res.status === 401) {
                    return res.text().then( (message) => Promise.reject({status: res.status, message: 'Unauthorized'}))                
                }
                return res.text().then( (message) => Promise.reject({status: res.status, message}))                
            } 
            return Promise.resolve(res.json());
        })
    }

    switch (method) {
        case 'get':
            get(cmd, params)
            .then(res => {
                console.log(JSON.stringify(res, null, 4))
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 4))
            })
        break
        case 'post':
            post(cmd, params)
            .then(res => {
                console.log(JSON.stringify(res, null, 4))
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 4))
            })
        break
        case 'put':
            put(cmd, params)
            .then(res => {
                console.log(JSON.stringify(res, null, 4))
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 4))
            })
        break
    }
}

module.exports = {
    handler
} 
