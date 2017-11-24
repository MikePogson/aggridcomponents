angular.module('aggridDatasettable', ['servoy', 'aggridenterpriselicensekey']).directive('aggridDatasettable', ['$sabloConstants', '$log', '$q', '$filter',
function($sabloConstants, $log, $q, $filter) {
    return {
        restrict: 'E',
        scope: {
            model: '=svyModel',
            handlers: '=svyHandlers',
            api: '=svyApi',
            svyServoyapi: '='
        },
        controller: function($scope, $element, $attrs) {

            var gridDiv = $element.find('.ag-table')[0];
            var columnDefs = getColumnDefs();

            var config = $scope.model;

            // AG grid definition
            var gridOptions = {
                
                debug: false,
                rowModelType: 'inMemory',
                rowData: $scope.model.data,
                rowGroupPanelShow: 'onlyWhenGrouping', // TODO expose property

                defaultColDef: {
                    width: 0,
                    suppressFilter: true,
//                    valueFormatter: displayValueFormatter,
                    menuTabs: ['generalMenuTab'] //, 'columnsMenuTab'] // , 'filterMenuTab']
                },
                columnDefs: columnDefs,
                getMainMenuItems: getMainMenuItems,

                rowHeight: $scope.model.rowHeight,
                // TODO enable it ?					rowClass: $scope.model.rowStyleClass,	// add the class to each row

                suppressContextMenu: false,
                suppressMovableColumns: true, // TODO persist column order changes
                enableColResize: config.enableColumnResize,
                suppressAutoSize: true,
                autoSizePadding: 25,
                suppressFieldDotNotation: true,

                suppressMovingInCss: true,
                suppressColumnMoveAnimation: true,
                suppressAnimationFrame: true,

                rowSelection: 'single',
                rowDeselection: false,
//                suppressRowClickSelection: rowGroupColsDefault.length === 0 ? false : true,
                suppressCellSelection: true, // TODO implement focus lost/gained
                enableRangeSelection: false,

                // stopEditingWhenGridLosesFocus: true,
                // singleClickEdit: true,
                // suppressClickEdit: false,
                // enableGroupEdit: false,
                // groupUseEntireRow: false,
                // groupMultiAutoColumn: true,

                pivotMode: $scope.model.pivotMode,

                animateRows: false,
                enableCellExpressions: true,

                onGridReady: function() {
                    $log.debug("gridReady");
                    // without timeout the column don't fit automatically
                    setTimeout(function() {
                        sizeColumnsToFit();
                    }, 150);
                },
                onGridSizeChanged: function() {
                    sizeColumnsToFit();
                },
                getContextMenuItems: getContextMenuItems,
                enableSorting: config.enableSorting
                
            };
            
            // set the icons
            var iconConfig = $scope.model.iconConfig;
            if(iconConfig) {
                var icons = new Object();
                if (iconConfig.iconGroupExpanded) icons.groupExpanded = getIconElement(iconConfig.iconGroupExpanded);
                if (iconConfig.iconGroupContracted) icons.groupContracted = getIconElement(iconConfig.iconGroupContracted);
                if (iconConfig.iconSortAscending) icons.sortAscending = getIconElement(iconConfig.iconSortAscending);
                if (iconConfig.iconSortDescending) icons.sortDescending = getIconElement(iconConfig.iconSortDescending);
                if (iconConfig.iconSortUnSort) icons.sortUnSort = getIconElement(iconConfig.iconSortUnSort);
                gridOptions.icons = icons
            }

            setHeight();

            // init the grid. If is in designer render a mocked grid
            if ($scope.svyServoyapi.isInDesigner()) {
                
                var designGridOptions = {
                    rowModelType: 'inMemory',
                    columnDefs: columnDefs,
                    rowHeight: $scope.model.rowHeight,
                    rowData: []
                };

                // init the grid
                new agGrid.Grid(gridDiv, designGridOptions);
                return;
            } else {
                // init the grid
                new agGrid.Grid(gridDiv, gridOptions);
            }

            gridOptions.api.addEventListener('cellClicked', onCellClicked);


            function getColumnDefs() {
                
                //create the column definitions from the specified columns in designer
                var colDefs = [];
                var colDef = { };
                var column;
                for (var i = 0; $scope.model.columns && i < $scope.model.columns.length; i++) {
                    column = $scope.model.columns[i];

                    //create a column definition based on the properties defined at design time
                    colDef = {
                        headerName: "" + (column["headerTitle"] ? column["headerTitle"] : "") + "",
                        field: column["id"]
                    };

                    // styleClass
                    colDef.headerClass = 'ag-table-header ' + column.headerStyleClass;
                    colDef.cellClass = 'ag-table-cell ' + column.styleClass;


                    colDef.enableRowGroup = column.enableRowGroup;
                    if (column.rowGroupIndex >= 0) colDef.rowGroupIndex = column.rowGroupIndex;

                    colDef.enablePivot = column.enablePivot;
                    if (column.pivotIndex >= 0) colDef.pivotIndex = column.pivotIndex;

                    if(column.aggFunc) colDef.aggFunc = column.aggFunc;

                    if (column.width || column.width === 0) colDef.width = column.width;
                    // TODO add minWidth and maxWidth to column.spec
                    if (column.maxWidth) colDef.maxWidth = column.maxWidth;
                    if (column.minWidth || column.minWidth === 0) colDef.minWidth = column.minWidth;
                    if (column.visible === false) colDef.hide = true;

                    colDefs.push(colDef);
                }

                return colDefs;
            }

            function isResponsive() {
                return !$scope.$parent.absoluteLayout;
            }

            function setHeight() {
                if (isResponsive()) {
                    gridDiv.style.height = $scope.model.responsiveHeight + 'px';
                }
            }

            function sizeColumnsToFit() {
                gridOptions.api.sizeColumnsToFit();
            }

            function getIconElement(iconStyleClass) {
                return '<i class="' + iconStyleClass + '"/>';
            }

            function getMainMenuItems(params) {
                // default items
                //					pinSubMenu: Submenu for pinning. Always shown.
                //					valueAggSubMenu: Submenu for value aggregation. Always shown.
                //					autoSizeThis: Auto-size the current column. Always shown.
                //					autoSizeAll: Auto-size all columns. Always shown.
                //					rowGroup: Group by this column. Only shown if column is not grouped.
                //					rowUnGroup: Un-group by this column. Only shown if column is grouped.
                //					resetColumns: Reset column details. Always shown.
                //					expandAll: Expand all groups. Only shown if grouping by at least one column.
                //					contractAll: Contract all groups. Only shown if grouping by at least one column.
                //					toolPanel: Show the tool panel.
                var menuItems = [];
                var items = ['rowGroup', 'rowUnGroup'];
                params.defaultItems.forEach(function(item) {
                    if (items.indexOf(item) > -1) {
                        menuItems.push(item);
                    }
                });
                return menuItems;
            }

            function getContextMenuItems(params) {
                // hide any context menu
                return [];
            }

            Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
                configurable: true,
                value: function(property, value) {
                    switch (property) {
                        case "responsiveHeight":
                            setHeight();
                            break;
                    }
                }
            });

            function onCellClicked(params) {
                $log.debug(params);
                if ($scope.handlers.onCellClick) {
                    var columnIndex = 0; // get column index
                    $scope.handlers.onCellClick(params.rowIndex, columnIndex, params.value, params.event);
                }
            }

            $scope.showEditorHint = function() {
                return (!$scope.model.columns || $scope.model.columns.length == 0) && $scope.svyServoyapi.isInDesigner();
            }

            /**
             *      API functions
             */

            $scope.api.renderData = function(dataset) {
                var data = [];
                for(var i = 1; i < dataset.length; i++) {
                    var rowData = {};
                    for(var j = 0; j < dataset[i].length; j++) {
                        rowData[dataset[0][j]] = dataset[i][j];
                    }
                    data.push(rowData);
                }
                $scope.model.data = data;
                gridOptions.api.setRowData($scope.model.data);
            }

            $scope.api.addColumn = function(index, column) {

            }

            $scope.api.removeColumn = function(id) {
                
            }

        },
        templateUrl: 'aggrid/groupingtable/groupingtable.html'
    };
}]).run(['$aggridenterpriselicensekey', function($aggridenterpriselicensekey) {
$aggridenterpriselicensekey.setLicenseKey();
}]);