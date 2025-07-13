import React, { useState, useEffect, useRef } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import LinkButton from "@/Components/LinkButton";
import Styles from "../../css/Modules/Emails.module.css";

const EmailRepliesList = ({ csrfToken, cancelReplies = 'cancelReplies', emailId, emailType, emailName, emailSubject }) => {
    /*const [emailName,setEmailName] = useState([]);
    const [emailSubject,setEmailSubject] = useState([]);*/
    const [repliesObj, setRepliesObj] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10; // Change based on how many you want per page

    useEffect(() => {
        getRepliesContent(1, false);
    }, []);
    
    const getRepliesContent = (pageNumber = 1, shouldAppend = true) => {
        const url = "emailreplies";
        const postJson = {
            "_token": csrfToken,
            "emailId": emailId,
            "emailType": emailType,
            "page": pageNumber,
            "pageSize": pageSize
        };
        
        httpRequest(url, postJson, function (resp) {
            if (resp.C === 100 && resp.R && resp.R.repliesList) {
                const newItems = resp.R.repliesList;
                if (newItems.length < pageSize) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
    
                // Replace or append data
                if (shouldAppend && pageNumber > 1) {
                    setRepliesObj(prev => [...prev, ...newItems]);
                } else {
                    setRepliesObj(newItems);
                }
    
                setPage(pageNumber);
            } else {
                setHasMore(false);
            }
        });
    };
    
    const handleLoadMore = () => {
        getRepliesContent(page + 1, true);
    };

    return (
        <div className={`midde_cont ${Styles.repliesListContainer}`}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="white_shd full margin_bottom_30">
                            <div className="full graph_head">
                                <div className="row">
                                    <div className="margin_0 col-md-6">
                                        <h2>List of replies</h2>
                                    </div>
                                    <div className="margin_0 col-md-6 text-right">
                                        <button style={{ border: 'none', background: 'none' }} onClick={cancelReplies}>
                                            <span>×</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <h5>Replies for {emailName}</h5>
                                    <h5>{emailSubject}</h5>
                                </div>

                            </div>
                            
                            <div className="table_section padding_infor_info">
                                <div className="table-responsive-sm">
                                
                                <div className="row">
                                    
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Reply From</th>
                                                <th>Subject</th>
                                                <th>Reply</th>
                                                <th>Date</th>
                                                <th>View</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {repliesObj.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                                        No replies available.
                                                    </td>
                                                </tr>
                                            ) : (
                                                repliesObj.map((replyRw, index) => (
                                                    <tr id={`reply_rw_${replyRw.id}`} key={replyRw.id}>
                                                        <td>
                                                            <span>{index + 1}</span>
                                                        </td>
                                                        <td>{replyRw.from}</td>
                                                        <td>{replyRw.subject} </td>
                                                        <td>{replyRw.content}</td>
                                                        <td>{replyRw.date}</td>
                                                        <td>
                                                            <LinkButton
                                                                type="button"
                                                                className={`btn p-0`}
                                                                onClick={() => viewReply(eplyRw.id)}
                                                                title="View"
                                                            >
                                                                <i className={`${Styles.filterTrashIcon} fa fa-eye`}></i>
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
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailRepliesList;