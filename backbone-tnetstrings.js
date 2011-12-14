(function(){

    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read'  : 'GET'
    };

    // Backbone.TNetStrings.sync
    // -------------

    //
    Backbone.TNetStrings = {
        sync: function(method, model, options, error) {
            var type = methodMap[method];

            // Default TNetStrings-request options.
            var params = {type : type, dataType : 'tnetstring'};

            // Ensure that we have a URL.
            if (!options.url) {
                params.url = getUrl(model) || urlError();
            }

            // Ensure that we have the appropriate request data.
            if (!options.data && model && (method == 'create' || method == 'update')) {
                params.contentType = 'application/tnetstring';
                params.data = tnetstrings.dump(model.toJSON());
            }

            // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
            // And an `X-HTTP-Method-Override` header.
            if (Backbone.emulateHTTP) {
                if (type === 'PUT' || type === 'DELETE') {
                    if (Backbone.emulateTNetStrings) params.data._method = type;
                    params.type = 'POST';
                    params.beforeSend = function(xhr) {
                        xhr.setRequestHeader('X-HTTP-Method-Override', type);
                    };
                }
            }


            // Make the request, allowing the user to override any Ajax options.
            return $.ajax(_.extend(params, options));
        }
    };

    // Helper function to get a URL from a Model or Collection as a property
    // or as a function.
    var getUrl = function(object) {
        if (!(object && object.url)) return null;
        return _.isFunction(object.url) ? object.url() : object.url;
    };

    // Throw an error when a URL is needed, and none is supplied.
    var urlError = function() {
        throw new Error('A "url" property or function must be specified');
    };

}).call(this);

