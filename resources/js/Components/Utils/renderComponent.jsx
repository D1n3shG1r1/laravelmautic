import ReactDOMCP from 'react-dom'
import ReactDOM from 'react-dom/client';

// Utility function to render a component into a DOM element
export const renderComponent = (Component, props, containerId, componentType) => {
    const container = document.getElementById(containerId);
    if (container) {
        //const root = ReactDOM.createRoot(container);
        //root.render(<Component {...props} />);

        // Using React Portal to append the component to the container
        //ReactDOMCP.createPortal(<CreateNode propJson={propJson} x={x} y={y} />, container);
        ReactDOMCP.createPortal(<Component {...props} />, container);
        

        console.log('props');
        console.log(props);
        
        if(componentType == 'CreateNode'){
            const type = props.type;
            const id = props.id;

            //create nodeEndpoints
            if (type === 'source') {
                const endpointLeft = <NodeEndpoints nodeType={type} endpointType="left" />;
                const endpointRight = <NodeEndpoints nodeType={type} endpointType="right" />;
                const endpointBottomCenter = <NodeEndpoints nodeType={type} endpointType="bottom-center" />;
               
                // Assuming `node` is a DOM element where you want to append these components
                const rootLeft = ReactDOM.createRoot(document.getElementById(id+'_endpointLeftHolder'));
                const rootRight = ReactDOM.createRoot(document.getElementById(id+'_endpointRightHolder'));
                const rootBottomCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomCenterHolder'));
               
                rootLeft.render(endpointLeft);
                rootRight.render(endpointRight);
                rootBottomCenter.render(endpointBottomCenter);
               
            }else if (type === 'decision' || type === 'condition') {
                const endpointTopCenter = <NodeEndpoints nodeType={type} endpointType="top-center" />;
                const endpointBottomLeft = <NodeEndpoints nodeType={type} endpointType="bottom-left" />;
                const endpointBottomRight = <NodeEndpoints nodeType={type} endpointType="bottom-right" />;
               
                const rootTopCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointTopCenterHolder'));
                const rootBottomLeft = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomLeftHolder'));
                const rootBottomRight = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomRightHolder'));
                
                rootTopCenter.render(endpointTopCenter);
                rootBottomLeft.render(endpointBottomLeft);
                rootBottomRight.render(endpointBottomRight);
               }else if(type == 'action'){
                    
                const endpointTopCenter = <NodeEndpoints nodeType={type} endpointType="top-center" />
                const endpointBottomCenter = <NodeEndpoints nodeType={type} endpointType="bottom-center" />
               
                const rootTopCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointTopCenterHolder'));
                const rootBottomCenter = ReactDOM.createRoot(document.getElementById(id+'_endpointBottomCenterHolder'));
                    
                rootTopCenter.render(endpointTopCenter);
                rootBottomCenter.render(endpointBottomCenter);
                    
               }
                
                // document.getElementById("campaign-builder").appendChild(node);
               
                // Make the node draggable and connectable
                // Initialize jsPlumb instance
                const instance = jsPlumb.getInstance({
                    //container: document.getElementById("campaign-builder"),
                    container: document.getElementById("CampaignCanvas"),
                });
               
                instance.draggable(Component); //node component
                
            }


    } else {
        console.error(`Container with ID "${containerId}" not found.`);
    }
};