"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapFactory(FieldMap) {
    return function (input) {
        if (!FieldMap ||
            Array.isArray(FieldMap) ||
            !Object.keys(FieldMap).length) {
            return {};
        }
        var result = {};
        for (var key in FieldMap) {
            if (typeof FieldMap[key] === 'boolean' && FieldMap[key]) {
                result[key] = input[key];
                continue;
            }
            if (typeof FieldMap[key] === 'string') {
                result[key] = input[FieldMap[key]];
                continue;
            }
            if (typeof FieldMap[key] === 'function') {
                var mapperValue = FieldMap[key](input);
                result[key] = mapperValue;
                continue;
            }
        }
        return result;
    };
}
exports.mapFactory = mapFactory;
function mapTypes(input, FieldMap) {
    return mapFactory(FieldMap)(input);
}
exports.mapTypes = mapTypes;
//# sourceMappingURL=index.js.map