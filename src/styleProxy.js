// 宽屏适配
GM_addStyle('#main .container { max-width: unset !important; }')
GM_addStyle('.m-execution-task td.c-name, td.c-title {white-space: normal;}')
GM_addStyle('.m-execution-task .main-table tbody>tr:nth-child(odd) { background: #fff !important; }')
GM_addStyle('.m-execution-task .main-table tbody>tr.table-children { background: #90939442 !important; }')
GM_addStyle('.m-execution-task .main-table .c-actions { width: 300px !important; text-align: left; }')
GM_addStyle('.m-execution-task .datatable-head-span.datatable-span.fixed-right,.datatable-rows-span.datatable-span.fixed-right { width: 300px !important; text-align: left; }')
GM_addStyle('.m-execution-task .main-table .c-actions-5 { width: 300px !important; text-align: left; }')
GM_addStyle('.m-execution-task .chosen-container .chosen-drop { right: 0; }')
GM_addStyle('.m-execution-task .table-datatable { min-width: unset !important; }')

// 看板
GM_addStyle('.m-execution-kanban .board-item > .title { max-height: unset !important; -webkit-line-clamp: unset !important; -webkit-box-orient: unset !important; font-size: 15px !important; }')
GM_addStyle('.m-execution-kanban #kanban .group-title { line-height: 20px !important; font-size: 15px !important; }')

// 弹出层，只看备注按钮
GM_addStyle('.histories-custom-filter-btn { margin-right: 8px }')

GM_addStyle('.custom-filter-btn { margin-right: 8px }')
GM_addStyle('.custom-filter-box {margin-top: 8px; margin-bottom: 8px}')