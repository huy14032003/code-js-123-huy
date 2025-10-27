<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
        <style>
            body {
                background-attachment: fixed;

            }

            #pagination-tbl_detail {
                display: flex;
                justify-content: end;
                align-items: center;
                gap: 5px;
            }

            #pagination-tbl_detail button {
                border: 1px solid #0a58ca;
                background-color: transparent;
                color: #0a58ca;
                border-radius: 5px;
                min-width: 2.3rem;
                /* width: 100%; */
                height: 2.3rem;
                font-size: 1rem;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #pagination-tbl_detail button:hover {
                background-color: #0a58ca;
                color: #fff;
            }

            #pagination-tbl_detail button.active {
                background-color: #4982d8;
                color: #fff;
            }

            #pagination-tbl_detail button:disabled {
                opacity: 0.4;
                cursor: not-allowed;
                color: #888;
                border-color: #444;
            }

            #table-4 td:first-child {
                width: 1rem;
            }

            #tableDetail th {
                text-wrap: nowrap;
                height: 2rem;
            }

            #tableDetail img {
                width: 2rem;
                height: 2rem;
            }

            #table-4 {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
                /* quan trọng */
            }

            #table-4 th:first-child,
            #table-4 td:first-child {
                background-color: #264b8b;
            }

            #daterange::placeholder {
                color: #fff !important;
            }

            .modal-xxl {
                max-width: 95vw !important;
                overflow: auto;
            }
        </style>

        <link rel="stylesheet"
            href="/sample-system/assets/css/factory_safety_daily_report/factory_safety_daily_report.css" />
        <link rel="stylesheet" href="/sample-system/assets/plugins/flatpickr/flatpickr.min.css " />
        <script src="/sample-system/assets/plugins/flatpickr/flatpickr.js"></script>
        <div class="container-fluid">
            <spring:message code="vietnamese" var="vietnamese" />
            <spring:message code="chinese" var="chinese" />
            <spring:message code="english" var="english" />
            <spring:message code="profile" var="profile" />
            <spring:message code="logout" var="logout" />

            <jsp:include page="/WEB-INF/jsp/common/header-dashboard.jsp">
                <jsp:param name="titlePage" value="BU 安全報告" />
                <jsp:param name="vietnamese" value="<%=pageContext.getAttribute(\" vietnamese\") %>" />
                    <jsp:param name="chinese" value="<%= pageContext.getAttribute(\" chinese\") %>" />
                        <jsp:param name="english" value="<%= pageContext.getAttribute(\" english\") %>" />
                            <jsp:param name="profile" value="<%=pageContext.getAttribute(\" profile\") %>" />
                                <jsp:param name="logout" value="<%= pageContext.getAttribute(\" logout\") %>" />
            </jsp:include>
        </div>
        <div class="container-fluid">
            <div class="row ">
                <div class="col-md-12 px-2 d-flex justify-content-start align-items-center gap-3">
                    <c:if test="${!iframeFlag}">
                        <button class="p-0 btn bg-transparent text-white" id="btnHome">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M5 20v-9.15L2.2 13L1 11.4L12 3l4 3.05V4h3v4.35l4 3.05l-1.2 1.6l-2.8-2.15V20h-5v-6h-4v6zm5-9.975h4q0-.8-.6-1.313T12 8.2t-1.4.513t-.6 1.312" />
                            </svg>
                        </button>
                    </c:if>
                    <input id="daterange" class="form-control bg-transparent text-white" readonly
                        style="max-width: 15rem;" placeholder="Chọn ngày">
                </div>
            </div>
        </div>
        <div class="container-fluid content-wrapper py-0 ">

            <div class="row">
                <div class="col-md-7 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span> 內部BBS</span>

                        </h5>
                        <div class="component-body chart-box " id="chart-6"></div>
                    </div>
                </div>
                <div class="col-md-5 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>Top 3</span>
                        </h5>
                        <div class="component-body chart-box " id="chart-8"></div>
                    </div>
                </div>
                <div class="col-md-8 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>內部BBS</span>
                        </h5>
                        <div class="component-body table-box ">
                            <div class="table-responsive h-100">
                                <table class="table table-sm table-striped h-100 border-top-0" id="table-7">
                                    <thead>
                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>Owner</span>
                        </h5>
                        <div class="component-body chart-box " id="chart-9"></div>
                    </div>
                </div>
            </div>
            <div class="row ">
                <div class="col-md-7 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>CBD/CN2 班前培训</span>
                        </h5>
                        <div class="component-body chart-box plus" id="chart-1"></div>
                    </div>
                </div>
                <div class="col-md-5 component-wrapper">
                    <div class="component-item">
                        <h5 class="component-title">細節</h5>
                        <div class="component-body table-box plus">
                            <div class="table-responsive h-100">
                                <table class="table table-sm table-striped h-100 border-top-0" id="table-1">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>部門</th>
                                            <th>線數</th>
                                            <th>線已培訓</th>
                                            <th>線未培訓</th>
                                            <th>比率</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row align-items-stretch">
                <div class="col-md-4 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>班前培训抽查</span>
                        </h5>
                        <div class="component-body chart-box plus" id="chart-10" style="height: 32vh;"></div>
                    </div>
                </div>
                <div class="col-md-8 component-wrapper">

                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title ">
                            <span>

                                <span id="title_table-8"></span>班前培训抽查趨勢
                            </span>
                        </h5>
                        <div class="component-body table-box flex-fill">
                            <div class="table-responsive h-100 overflow-y-auto">
                                <table class="table table-sm table-striped h-100 border-top-0" id="table-8">
                                    <thead style="height: 3.5rem;">
                                        <tr>
                                            <th>#</th>
                                            <th>部門 </th>
                                            <th>抽查人數</th>
                                            <th>抽查Pass </th>
                                            <th>抽查Fail</th>
                                            <th>Pass趨勢</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="row align-items-stretch">
                <div class="col-md-6 component-wrapper">
                    <div class="component-item position-relative">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            MOC 處理進度
                        </h5>
                        <div class="component-body chart-box plus" id="chart-2"></div>
                    </div>
                </div>

                <div class="col-md-6 component-wrapper">
                    <div class="component-item">
                        <h5 class="component-title">CBD-CN2 MOC 完成簽核進度統計表</h5>
                        <div class="component-body table-box plus">
                            <div class="table-responsive h-100">
                                <table class="table table-sm table-striped h-100" id="table-2">
                                    <thead>

                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row align-items-stretch">
                <div class="col-md-4 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>推動項目</span>
                        </h5>
                        <div class="component-body chart-box plus" id="chart-7" style="height: 32vh;"></div>
                    </div>
                </div>
                <div class="col-md-8 component-wrapper">

                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title ">
                            <span>

                                CBD-CN2《<span id="title_table-5"></span>》 完成進度 <span id="dateTitle">（2025.10.13）</span>
                                deadline (<span id="deadLineTitle"> 2025.10.20</span> )
                            </span>
                        </h5>
                        <div class="component-body table-box flex-fill">
                            <div class="table-responsive h-100 overflow-y-auto">
                                <table class="table table-sm table-striped h-100 border-top-0" id="table-5">
                                    <thead style="height: 3.5rem;">
                                        <tr>
                                            <th>#</th>
                                            <th>Project</th>
                                            <th>部門</th>
                                            <th>部門負責主管 </th>
                                            <th>總人力</th>
                                            <th>已完成 </th>
                                            <th>未完成</th>
                                            <th>比率</th>
                                            <th>QR Code</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="row align-items-stretch">
                <div class="col-md-12 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between   gx-2 component-title">
                            外部稽核計劃通报
                        </h5>
                        <div class="component-body table-box flex-fill">
                            <div class="table-responsive h-100 overflow-y-auto">
                                <table class="table table-sm table-striped h-100 border-top-0" id="table-6">
                                    <thead style="height: 3rem; ">
                                        <tr>
                                            <th>#</th>
                                            <th>稽核項目</th>
                                            <th>稽核主要</th>
                                            <th>稽核時間</th>
                                            <th>稽核部門 </th>
                                            <th>需要配合部門</th>
                                            <th>稽核問題點</th>
                                            <th>狀態</th>
                                            <th>備註</th>
                                            <th>工作</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="row align-items-stretch">
                <div class="col-md-6 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>CBD-GZ紀率</span>
                            <div id="legend-chart-3" class="d-flex align-items-center"></div>
                        </h5>
                        <div class="component-body chart-box " id="chart-4"></div>
                    </div>
                </div>
                <div class="col-md-6 component-wrapper">
                    <div class="component-item">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>CBD-GZ紀率細節</span>
                        </h5>
                        <div class="component-body table-box flex-fill" style="height: 26vh;">
                            <div class="table-responsive h-100 overflow-y-auto">
                                <table class="table table-sm table-striped h-100 border-top-0" id="table-4">
                                    <thead style="height: 2.5rem;">

                                    </thead>
                                    <tbody></tbody>
                                    <tfoot></tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 component-wrapper">
                    <div class="component-item position-relative ">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            <span>截止6月份 CBD-GZ千人違紀率</span>
                        </h5>
                        <div class="component-body chart-box plus " id="chart-5" style="height: 37vh;"></div>
                    </div>
                </div>

                <div class="col-md-6 component-wrapper">
                    <div class="component-item position-relative " style="font-size: 0.85rem;">
                        <h5 class="w-100 d-flex align-items-center justify-content-between gx-2 component-title">
                            截止10/14 CBD-GZ人員違紀共發生了 17起 , ( 本周無發生人員違紀異常）
                        </h5>
                        <span>
                            <!-- <p class="mb-0">違紀分析：<span>人員違紀類別為：</span></p> -->
                            <p class="mb-0 text-primary">違紀分析：<span class="text-light">人員違紀類別為：</span></p>
                            <ol class="mb-0 text-danger">
                                <li>員工在未規定吸煙區域進行吸煙：5起 佔比 29%</li>
                                <li>違反門禁管制規定：3起 佔比18%</li>
                                <li>毆打同仁：2起 （2人違紀） 佔比12%</li>
                                <li>員工在工作時間睡覺：2起佔比12%</li>
                                <li>偷竊他人資產： 2起佔比12%</li>
                                <li>员工穿拖鞋上班：1起 佔比6%</li>
                                <li>未保管好VIP臨時證至客戶帶離出廠丟失：1起 佔比6%</li>
                                <li>員工在工作時間玩手機：1起佔比6%</li>
                            </ol>
                            <p class="mb-0 text-primary">改善對策：</p>
                            <ol class="mb-0">
                                <li>要求各部門加強宣導所有員工遵守公司的規定，訓練頻率每個月一次 =》
                                    Owne: 所有部門 負責監督人: 阮文實 Status: Ongoing </li>
                                <li>在每個進出門崗安裝提醒員工遵守安全規定的语音器 =》Owner:安全專員（阮文實）Status: Done</li>
                                <li>將公司規定進入班前三分鐘培訓系統，每天進行宣導 =》Owner：安全專員（阮文實）Status: Done</li>
                                <li>部門發生人員違紀異常需要提供8D 報告 （<span class="text-danger">上三級主管連帶處分</span>）</li>
                            </ol>
                        </span>
                    </div>
                </div>

            </div>
            <div class="row">
                <div class="col-md-12 component-wrapper">

                    <div class="component-item">
                        <h5 class="component-title pb-0">BBS 2025/10</h5>
                        <div class="component-body chart-box plus" id="chart-3" style="height: 40vh;"></div>
                        <div class="component-body table-box flex-fill" style="height: 20vh;">
                            <div class="table-responsive h-100 overflow-y-auto">
                                <table class="table table-sm table-striped h-100" id="table-3">
                                    <thead style="height: 4rem;">
                                        <tr>
                                            <th></th>
                                            <th>王全成</th>
                                            <th>張強</th>
                                            <th>宋國賢</th>
                                            <th>李煥</th>
                                            <th>鐘鍾</th>
                                            <th>張偉</th>
                                            <th>曾凡天</th>
                                            <th>楊乾鴻</th>
                                            <th>鄒雲華</th>
                                            <th>阮文賢</th>
                                            <th>余燦</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Button trigger modal -->

        <!-- Modal -->
        <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xxl modal-dialog-scrollable">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title" id="myModalLabel">細節</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body w-100">
                        <div class="table-responsive w-100">
                            <table class="table w-100" id="tableDetail">
                                <thead>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <div class="mt-3" id="pagination-tbl_detail"></div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                    </div>

                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="detailBBS" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xxl modal-dialog-scrollable"> <!-- đổi modal-lg → modal-sm nếu muốn nhỏ -->
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">細節BBS</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table" id="table-9">
                                <thead>
                                    <tr style="text-wrap: nowrap;"> 
                                        <th>#</th>
                                        <th>樓棟</th>
                                        <th>稽核時間</th>
                                        <th>屬性</th>
                                        <th>責任單位</th>
                                        <th>類別</th>
                                        <th>內容描述</th>
                                        <th>稽核圖片</th>
                                        <th>稽核主管</th>
                                        <th>責任人</th>
                                        <th>原因分析</th>
                                        <th>改善對策</th>
                                        <th>改善后圖片</th>
                                        <th>狀態</th>
                                        <th>完成時間</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="detailTop3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xxl modal-dialog-scrollable"> <!-- đổi modal-lg → modal-sm nếu muốn nhỏ -->
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">細節Top 3</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table" id="table-11" >
                                <thead>
                                    <tr style="text-wrap: nowrap;">
                                        <th>#</th>
                                        <th>樓棟</th>
                                        <th>稽核時間</th>
                                        <th>屬性</th>
                                        <th>責任單位</th>
                                        <th>類別</th>
                                        <th>內容描述</th>
                                        <th>稽核圖片</th>
                                        <th>稽核主管</th>
                                        <th>責任人</th>
                                        <th>原因分析</th>
                                        <th>改善對策</th>
                                        <th>改善后圖片</th>
                                        <th>狀態</th>
                                        <th>完成時間</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="detailOwner" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xxl modal-dialog-scrollable"> 
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">細節Owner</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table" id="table-10" >
                                <thead>
                                    <tr style="text-wrap: nowrap;">
                                        <th>#</th>
                                        <th>樓棟</th>
                                        <th>稽核時間</th>
                                        <th>屬性</th>
                                        <th>責任單位</th>
                                        <th>類別</th>
                                        <th>內容描述</th>
                                        <th>稽核圖片</th>
                                        <th>稽核主管</th>
                                        <th>責任人</th>
                                        <th>原因分析</th>
                                        <th>改善對策</th>
                                        <th>改善后圖片</th>
                                        <th>狀態</th>
                                        <th>完成時間</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        
                    </div>
                </div>
            </div>
        </div>

        <script type="module" src="/sample-system/assets/js/factory_safety_daily_report/index.js"></script>