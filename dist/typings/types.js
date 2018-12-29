System.register([], function(exports_1) {
    var TargetTypes, BuildStates;
    return {
        setters:[],
        execute: function() {
            exports_1("TargetTypes", TargetTypes = {
                Builds: "build",
                Projects: "project"
            });
            exports_1("BuildStates", BuildStates = {
                SUCCESS: 100,
                PENDING_AND_SUCCESS: 65,
                PENDING: 50,
                PENDING_AND_FAILED: 35,
                QUEUED: 25,
                FAILED: 0
            });
        }
    }
});
//# sourceMappingURL=types.js.map