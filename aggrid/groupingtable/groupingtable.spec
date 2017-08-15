{
	"name": "aggrid-groupingtable",
	"displayName": "Grouping Table",
	"version": 1,
	"definition": "aggrid/groupingtable/groupingtable.js",
	"serverscript": "aggrid/groupingtable/groupingtable_server.js",
	"libraries": [
		{
			"name": "ag-grid.js",
			"version": "1",
			"url": "aggrid/groupingtable/lib/dist/ag-grid.js",
			"mimetype": "text/javascript"
		},
		{
			"name": "ag-grid-enterprise.js",
			"version": "1",
			"url": "aggrid/groupingtable/lib/dist/ag-grid-enterprise.js",
			"mimetype": "text/javascript"
		},
		{
			"name": "ag-grid.css",
			"version": "1",
			"url": "aggrid/groupingtable/lib/dist/styles/ag-grid.css",
			"mimetype": "text/css"
		}],
	"model":
	{
		"myFoundset": {"type": "foundset", "dynamicDataproviders": true, "initialPreferredViewPortSize": 15, "sendSelectionViewportInitially": true },
		"columns": 		{ "type": "column[]", "droppable" : true },
		"rowHeight" : 	{"type" : "int", "default": 25},
		"visible": "visible",
		"hashedFoundsets": { "type": "hashedFoundset[]", "default": [], "tags": {"scope": "private"}},
		"hashedColumns": {"type" : "string[]", "default": [], "tags": {"scope": "private"}}
	},
	"handlers" : {
	
		"onRowSelected": {
			"description": "Called when a row is selected",
			"parameters": [{
				"name": "index",
				"type": "int"
			}, {
				"name": "row",
				"type": "object",
				"optional": true
			}, {
				"name": "event",
				"type": "JSEvent",
				"optional": true
			}]
		},
		"onGroupChanged" : {
			"parameters": 
			[
				{
					"name": "columnIndex",
					"type": "int"
				},
				{
					"name": "groupIndex",
					"type": "int"
				},
				{
					"name": "isGrouped",
					"type": "boolean"
				}
			]
		},
		"onNodeExpanded" : {
			"parameters": 
			[
				{
					"name": "columnIndex",
					"type": "int"
				},
				{
					"name": "value",
					"type": "string"
				}
			],
			"returns" : "dataset"
		}
	}, 
	"internalApi" : {
		"getGroupedFoundsetUUID" : {
            "returns" : "foundsetRef",
            "parameters" :
            [{
                    "name": "groupColumns",
                    "type": "int[]"
                }, {
                    "name": "groupKeys",
                    "type": "object[]"
                }, {
                	"name" : "idForFoundsets",
                	"type" : "string[]"
                }
            ]
        },
		"getGroupedChildFoundsetUUID" : {
            "returns" : "foundsetRef",
            "parameters" :
            [{
                    "name" : "parentFoundset",
                    "type" : "foundsetRef"
                }, {
                    "name" : "parentRecordFinder",
                    "type" : "rowRef"
                }, {
                    "name": "parentLevelGroupColumnIndex",
                    "type": "int"
                }, {
                    "name": "newLevelGroupColumnIndex",
                    "type": "int"
                }, {
                	"name" : "idForFoundsets",
                	"type" : "string[]"
                }
            ]
        },
        "getLeafChildFoundsetUUID" : {
            "returns" : "foundsetRef",
            "parameters" :
            [{
                    "name" : "parentFoundset",
                    "type" : "foundsetRef"
                }, {
                    "name" : "parentRecordFinder",
                    "type" : "object"
                }, {
                    "name": "parentLevelGroupColumnIndex",
                    "type": "int"
                }, {
                	"name" : "idForFoundsets",
                	"type" : "string[]"
                }
            ]
        }
	},
	"types" : {
		"column" : {
			"dataprovider": { "type": "dataprovider", "forFoundset": "myFoundset" },
			"headerTitle": {"type" : "tagstring"},
			"styleClass" : {"type" : "styleclass"},
			"format" : {"type" : "format",  "for": ["valuelist", "dataprovider"]},
			"valuelist": { "type": "valuelist", "for": "dataprovider" },
			"visible":  { "type": "boolean", "default": true },
			"enableRowGroup" : {"type": "boolean", "default" : true},
			"rowGroupIndex":  {"type": "int", "default": null},
			"onActionMethodID" : "function"
		},
		 "hashedFoundset" : {
            "foundset": "foundset",
            "foundsetUUID": "foundsetRef",
            "query" : "object"
        }  
	}
}