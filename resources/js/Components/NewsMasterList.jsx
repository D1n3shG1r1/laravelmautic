import React, { useState, useEffect, useRef } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import LinkButton from "@/Components/LinkButton";
import Styles from "../../css/Modules/Emails.module.css";

const NewsMasterList = ({ csrfToken, cancelNewsletter = 'cancelNewsletter', onCreateNewsletter }) => {
    const [websiteName, setWebsiteName] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [newsLettersObj, setNewsLettersObj] = useState([]);
    const formRef = useRef(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10; // Change based on how many you want per page
    
    useEffect(() => {
        getNewsContent(1, false);
    }, []);

    const getNewsContent = (pageNumber = 1, shouldAppend = true) => {
        const url = "newsletters/getnewswebsites";
        const postJson = {
            "_token": csrfToken,
            "websiteName": websiteName,
            "fromDate": fromDate,
            "toDate": toDate,
            "page": pageNumber,
            "pageSize": pageSize
        };
    
        httpRequest(url, postJson, function (resp) {
            if (resp.C === 100 && resp.R && resp.R.websitesList) {
                const newItems = resp.R.websitesList;
                if (newItems.length < pageSize) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
    
                // Replace or append data
                if (shouldAppend && pageNumber > 1) {
                    setNewsLettersObj(prev => [...prev, ...newItems]);
                } else {
                    setNewsLettersObj(newItems);
                }
    
                setPage(pageNumber);
            } else {
                setHasMore(false);
            }
        });
    };

    const handleLoadMore = () => {
        getNewsContent(page + 1, true);
    };

    const createNewsletter = () => {
        const checkBoxes = document.querySelectorAll('.row-check:checked');
        if (!checkBoxes || checkBoxes.length === 0) {
            showToastMsg(1, 'Select the websites to create newsletter.');
            return false;
        }

        if (checkBoxes.length > 10) {
            showToastMsg(1, 'You can select maximum 10 websites to create newsletter.');
            return false;
        }

        const tmpIdsArr = Array.from(checkBoxes).map(box => box.value);
        
        const url = "newsletters/createnewsletter";
        const postJson = {
            "_token": csrfToken,
            "selectedWebsitesId": tmpIdsArr
        };
        
        httpRequest(url, postJson, function (resp) {
            // Call the parent function with the response
            if (onCreateNewsletter) {
                onCreateNewsletter(resp);  // Pass response to parent
            }
        });

    };

    return (
        <div className={`midde_cont ${Styles.websiteListContainer}`}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="white_shd full margin_bottom_30">
                            <div className="full graph_head">
                                <div className="row">
                                    <div className="margin_0 col-md-6">
                                        <h2>List of websites</h2>
                                    </div>
                                    <div className="margin_0 col-md-6 text-right">
                                        <button style={{ border: 'none', background: 'none' }} onClick={cancelNewsletter}>
                                            <span>×</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <h5>Choose the content for the newsletter.</h5>
                                </div>

                            </div>
                            
                            <div className="table_section padding_infor_info">
                                <div className="table-responsive-sm">
                                <div className="row">
                                    <div className="col-md-6">
                                        <form className="filter-form">
                                            <div className="row form-group">
                                                <div className="col-md-3">
                                                
                                                    <InputLabel htmlFor="websiteInput" className="block font-medium text-sm text-gray-700 " value="Website"/>
                                                    <TextInput id="websiteInput" name="websiteName" placeholder="Website Name" type="text" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm form-control form-control-sm" value={websiteName} onChange={e => setWebsiteName(e.target.value)}/>
                                                </div>
                                                <div className="col-md-3">
                                                
                                                    <InputLabel htmlFor="filterFromDate" className="block font-medium text-sm text-gray-700 " value="From"/>
                                                    <TextInput id="filterFromDate" name="fromDate" placeholder="From date" type="date" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm form-control form-control-sm" value={fromDate} onChange={e => setFromDate(e.target.value)}/>
                                                </div>
                                                <div className="col-md-3">
                                                    <InputLabel htmlFor="filterToDate" className="block font-medium text-sm text-gray-700 " value="To"/>
                                                    <TextInput id="filterToDate" name="toDate" placeholder="To date" type="date" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm form-control form-control-sm" value={toDate} onChange={e => setToDate(e.target.value)}/>
                                                </div>
                                                <div className={`col-md-3 ${Styles.pdTop22}`}>
                                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => getNewsContent(1, false)}>Apply Filter</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className={`col-md-6 ${Styles.createNewsletterFormBox}`}>
                                        <form className={`newsletter-form ${Styles.pdTop22}`}>
                                            <TextInput type="hidden" id="sitemapsInput" name="sitemapsInput" />
                                            <button type="button" className="btn btn-primary createNewsletterBttn" onClick={createNewsletter}>Create Newsletter</button>
                                        </form>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <form className="newsletter-form">
                                        <input type="hidden" id="sitemapsInput" name="sitemaps" />
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Website</th>
                                                    <th>Heading</th>
                                                    <th>Content</th>
                                                    <th>Author</th>
                                                    <th>View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newsLettersObj.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                                            No website available.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    newsLettersObj.map((newsLetterRw, index) => (
                                                        <tr id={`news_rw_${newsLetterRw.id}`} key={newsLetterRw.id}>
                                                            <td>
                                                                <Checkbox
                                                                    className="row-check"
                                                                    name="sitemap[]"
                                                                    defaultValue={newsLetterRw.id}
                                                                />
                                                                <span>{index + 1}</span>
                                                            </td>
                                                            <td>{newsLetterRw.Website} {newsLetterRw.PageLink}</td>
                                                            <td>{newsLetterRw.Heading} {newsLetterRw.SubHeading}</td>
                                                            <td>{newsLetterRw.Body}</td>
                                                            <td>{newsLetterRw.Author} <br /> {newsLetterRw.PublishDate}</td>
                                                            <td>
                                                                <LinkButton
                                                                    type="button"
                                                                    className={`btn p-0`}
                                                                    onClick={() => editEmail(newsLetterRw.id)}
                                                                    title="Edit"
                                                                >
                                                                    <i className={`${Styles.filterTrashIcon} fa fa-edit`}></i>
                                                                </LinkButton>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                        {hasMore && (
                                            <div className="text-center">
                                                <button className="btn btn-secondary mt-3" onClick={handleLoadMore}>
                                                    Load More
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsMasterList;
