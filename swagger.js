
const to_parts = (name) => name.split('/').slice(2)
const to_cmd = (name) => to_parts(name).join('/')
const to_title = (name) => to_parts(name).reverse().join(' ')
const to_alias = (name) => name[0]

const to_map = (prev, curr) => { 
    prev[curr.name] = curr 
    return prev;  
} 

const to_method = (def) => { 
    if (def.post) return 'post'
    if (def.put) return 'put'
    if (def.get) return 'get'
} 

const dig = (obj, ...path) => {
    if (typeof obj === 'undefined') return undefined
    if (path.length === 0) return obj

    const key = path.shift()
    if (typeof obj[key] !== 'undefined') return dig(obj[key], ...path)
    return undefined
}

const map_post = (def) => {
    const properties = dig(def, 'requestBody', 'content', 'application/json', 'schema', 'properties') || []
    return Object.entries(properties)
        .map(([name, {type, format}]) => 
            ({
                name, 
                type, 
                format, 
                demand: true, 
                alias: to_alias(name), 
                title: to_title(name), 
                description: to_title(name)
            })
        )
}

const map_put = (def) => {
    const properties = dig(def, 'requestBody', 'content', 'application/json', 'schema', 'properties') || []
    return Object.entries(properties)
        .map( ([name, {type, format}]) => 
            ({
                name, 
                type, 
                format, 
                demand: true, 
                alias: to_alias(name), 
                title: to_title(name), 
                description: to_title(name)
            })
        )
}
const map_get = (def) => {
    const parameters = dig(def, 'parameters') || []
    return parameters
        .map( ({name, schema: {type, format}}) => 
            ({
                name, 
                type, 
                format, 
                demand: true, 
                alias: to_alias(name), 
                title: to_title(name), 
                description: to_title(name)
            })
        )
}


const get_methods = (api) => {
    return Object.entries(api.paths).map( ([path, def]) => path )    
}

const get_method = (api, path) => {
    return api.paths[path]
}

const method_to_command = (path, _method) => {
    const method = to_method(_method)
    const cmd = to_cmd(path)
    const title = to_title(path)
    var definition = {}

    switch (method) {
        case 'post':
            definition = map_post(_method.post).reduce(to_map, {})
        break
        case 'put':
            definition = map_put(_method.put).reduce(to_map, {})
        break
        case 'get':
            definition = map_get(_method.get).reduce(to_map, {})
        break
    }
    
    return {cmd, title, method, definition}
}

module.exports = {
    get_methods,
    get_method,
    method_to_command
}
