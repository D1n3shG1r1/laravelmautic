import React, { useState, useEffect, useRef } from "react";
import Layout from '@/Layouts/Layout';  // Import the layout component
import NavLink from '@/Components/NavLink';
import LinkButton from "@/Components/LinkButton";
import ConfirmBox from '@/Components/ConfirmBox';
import Styles from "../../css/Modules/Emails.module.css";

const NewsMasterList = ({pageTitle,csrfToken,params}) => {

    const [websiteName, setWebsiteName] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    //const [newsLettersObj, setNewsLettersObj] = useState([]);
    const formRef = useRef(null);
    const newsLettersObj = params.news.data;
    
    const links = params.news.links;

    let prevLink = links[0]?.url || '';
    let nextLink = links[links.length - 1]?.url || '';

    let prevHref = '';
    let prevDisable = '';
    let nextHref = '';
    let nextDisable = '';

    let activePageNum = "";
    // Loop through the links to find the active page number
    links.forEach((link) => {
        if (link.active) {
            activePageNum = link.label; // Assign the active page number
        }
    });

    if (prevLink) {
        prevHref = prevLink;
        prevDisable = "";
    } else {
        prevHref = "#"; // Avoid "javascript:void(0)"
        prevDisable = "disabled";
    }

    if (nextLink) {
        nextHref = nextLink;
        nextDisable = "";
    } else {
        nextHref = "#"; // Avoid "javascript:void(0)"
        nextDisable = "disabled";
    }

    // If activePageNum is not set (for any reason), default to 1
    if (!activePageNum) {
        activePageNum = "1";
    }

    const editNews = (id) => {
        window.location.href = window.url('news/edit/'+id);
    }
    
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const [currentId, setCurrentId] = useState(null); // State to hold the current ID
    const [currentName, setCurrentName] = useState(null); // State to hold the current ID
    
    const deleteNews = (news) => {
        const name = news.Heading;
        setCurrentId(news.id); // Set the ID when the confirm box is shown
        setCurrentName(name);
        setShowConfirmBox(true); // Show the custom confirmation box
    };
    
    const handleYes = () => {
      
        const url = "news/websitedelete";
        const postJson = {
            "_token": csrfToken,
            "id": currentId
        };
        
        httpRequest(url, postJson, function(resp){
            var C = resp.C;
            var error = resp.M.error;
            var msg = resp.M.message;
            var R = resp.R;
            
            if(C == 100 && error == 0){
                //signup successfull
                showToastMsg(error, msg);
                
                document.getElementById("news_rw_"+currentId).remove();

                window.location.href = params.newsUrl;

            }else{
               showToastMsg(error, msg);
            }
        
            setShowConfirmBox(false); // Hide the custom confirmation box
            
        });

      
    };
  
    const handleNo = () => {
      setShowConfirmBox(false); // Hide the custom confirmation box
    };

return (
    <Layout pageTitle={pageTitle}>
            <div className="midde_cont">
                <div className="container-fluid">
                    <div className="row column_title">
                        <div className="col-md-12">
                            <div className="page_title row">
                                <div className="col-md-6">
                                    <h2>News</h2>
                                </div>
                                <div className={`${Styles.textAlignRight} col-md-6`}>
                                    <NavLink className="btn cur-p btn-outline-primary" href="news/newwebsite">
                                        <i className={`${Styles.newBtnIcon} fa fa-plus`}></i> New Website
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="white_shd full margin_bottom_30">
                                <div className="full graph_head">
                                    <div className="heading1 margin_0">
                                        <h2>News List</h2>
                                    </div>
                                </div>
                                <div className="table_section padding_infor_info">
                                    <div className="table-responsive-sm">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Website</th>
                                                    <th>Heading</th>
                                                    <th>Content</th>
                                                    <th>Author</th>
                                                    <th>Pick Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {newsLettersObj.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                                        No website available.
                                                    </td>
                                                </tr>
                                            ) : (
                                                newsLettersObj.map((newsLetterRw, index) => (
                                                    <tr id={`news_rw_${newsLetterRw.id}`} key={newsLetterRw.id}>
                                                        <td>
                                                            <span>{index + 1}</span>
                                                        </td>
                                                        <td>{newsLetterRw.Website} {newsLetterRw.PageLink}</td>
                                                        <td>{newsLetterRw.Heading} {newsLetterRw.SubHeading}</td>
                                                        <td>{newsLetterRw.Body}</td>
                                                        <td>{newsLetterRw.Author} <br /> {newsLetterRw.PublishDate}</td>
                                                        <td>{newsLetterRw.PickupDate}</td>
                                                        <td>
                                                            <LinkButton
                                                                type="button"
                                                                className={`btn p-0`}
                                                                onClick={() => editNews(newsLetterRw.id)}
                                                                title="Edit"
                                                            >
                                                                <i className={`${Styles.filterTrashIcon} fa fa-edit`}></i>
                                                            </LinkButton>

                                                            <span className={`${Styles.buttonSeprator}`}></span>

                                                            <LinkButton type="button" className={`btn p-0`} onClick={() => deleteNews(newsLetterRw)} data-bs-toggle="tooltip" title="Delete">
                                                                <i className={`${Styles.filterTrashIcon} fa fa-trash-o`}></i>
                                                            </LinkButton>
                                                            
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="btn-group mr-2 pagination button_section button_style2">
                                        <a
                                            className={`btn paginate_button previous ${prevDisable}`}
                                            href={prevHref}
                                            aria-controls="DataTables_Table_0"
                                            data-dt-idx="0"
                                            tabIndex="-1"
                                            id="DataTables_Table_0_previous"
                                        >
                                            <i className="fa fa-angle-double-left"></i>
                                        </a>

                                        <a
                                            className="btn active paginate_button current"
                                            aria-controls="DataTables_Table_0"
                                            data-dt-idx="1"
                                            tabIndex="0"
                                        >
                                            {activePageNum}
                                        </a>

                                        <a
                                            className={`btn paginate_button next ${nextDisable}`}
                                            href={nextHref}
                                            aria-controls="DataTables_Table_0"
                                            data-dt-idx="2"
                                            tabIndex="-1"
                                            id="DataTables_Table_0_next"
                                        >
                                            <i className="fa fa-angle-double-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmBox && (
            <ConfirmBox
                message={`Delete the news, ${currentName} (${currentId})?`}
                onConfirm={handleYes}
                onCancel={handleNo}
            />
            )}
        </Layout>
);
};

export default NewsMasterList;