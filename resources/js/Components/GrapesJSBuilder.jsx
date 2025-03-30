import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';

const GrapesJSBuilder = ({ containerId, apiUrl, isVisible, onClose, onApply, template }) => {
  const editorRef = useRef(null);
  const currentColor = '#e5e7eb';
  var gridItems = '<table class="grid-item-card"><tr><td class="grid-item-card-cell"><img class="grid-item-image" src="https://via.placeholder.com/250x150/78c5d6/fff/" alt="Image"/><table class="grid-item-card-body"><tr><td class="grid-item-card-content"><h1 class="card-title">Title here</h1><p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p></td></tr></table></td></tr></table>';

  var listItems = '<table class="list-item"><tr><td class="list-item-cell"><table class="list-item-content"><tr class="list-item-row"><td class="list-cell-left"><img class="list-item-image" src="https://via.placeholder.com/150/78c5d6/fff" alt="Image"/></td><td class="list-cell-right"><h1 class="card-title">Title here</h1><p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p></td></tr></table></td></tr></table>';
  
  useEffect(() => {
    if (!isVisible || !template) return; // Do nothing if not visible
    
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      body {
        overflow-x: hidden;
      }
      [data-gjs-type="wrapper"] {
        width: 100%;
        max-width: 100%;
      }
    `;
    
  }, []);

  useEffect(() => {
    if (editorRef.current) return;
    //editorRef.current = true;  // Prevent re-initialization

    const editor = grapesjs.init({
      container: `#${containerId}`,
      fromElement: true,
      height: '100vh',
      width: '100%',
      assetManager: {
        storageType:'',
        storeOnChange:true,
        storeAfterUpload:true,
        upload:true,
        assets:[],
        uploadFile:function(e){
          
          var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

          console.log('files');
          console.log(files);

          if (files.length === 1) {
            const file =  files[0];

            // Allowed MIME types
            const allowedTypes = ['image/jpeg', 'image/png'];

            // Check if the file type is valid
            if (allowedTypes.includes(file.type)) {
              console.log('Selected file:', file);
              const reader = new FileReader();
              reader.onload = function(e) {

                var url = "media/save";
                var postJson = {
                  "base64": e.target.result
                };

                httpRequest(url, postJson, function(resp){
                  if(resp.C == 100){
                    const image = resp.R.imagepath;
                    editor.AssetManager.add(image);
                  }
                });

              };
              reader.readAsDataURL(file);
            }else{
              var err = 1;
              var msg = "Invalid file type. Only JPG, JPEG, and PNG are allowed.";
              showToastMsg(err, msg);
              return false;
            }
            
          }else{
            var err = 1;
            var msg = "Please select only one file.";
            showToastMsg(err, msg);
            return false;
          }

        }
      },
      storageManager: false,
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'Desktop', width: '' },
          { id: 'tablet', name: 'Tablet', width: '768px' },
          { id: 'mobile', name: 'Mobile', width: '375px' }
        ],
      },
      plugins: [grapesjsPresetWebpage],
      pluginsOpts: {
        grapesjsPresetWebpage: {}
      },
      blockManager: {
        //appendTo: '#blocks',
        blocks: [
          // Sections
          {
            id: '1-column',
            label: '1 Column',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/></svg>',
            content: '<table style="height: 150px; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;"><tr><td style="font-size: 12px;font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0;"></td></tr></table>',
            category: 'Sections' 
          },
          {
            id: '2-column',
            label: '2 Column',
            media: '<svg viewBox="0 0 23 24"><path fill="'+currentColor+'" d="M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z"/></svg>',
            content: '<table style="height: 150px; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;"><tr><td style="font-size: 12px;font-weight: 300;vertical-align: top;color: rgb(111, 119, 125);margin: 0;padding: 0;width: 50%;"></td><td style="font-size: 12px;font-weight: 300;vertical-align: top;color: rgb(111, 119, 125);margin: 0;padding: 0;width: 50%;"></td></tr></table>',
            category: 'Sections'
          },
          {
            id: '3-column',
            label: '1/3 Section',
            media: '<svg viewBox="0 0 23 24"><path fill="'+currentColor+'" d="M2 20h4V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM17 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1ZM9.5 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"/></svg>',
            content: '<table style="height: 150px;margin: 0 auto 10px auto;padding: 5px 5px 5px 5px;width: 100%;"><tr><td style="font-size: 12px;font-weight: 300;vertical-align: top;color: rgb(111, 119, 125);margin: 0;padding: 0;width: 33.3333%;"></td><td style="font-size: 12px;font-weight: 300;vertical-align: top;color: rgb(111, 119, 125);margin: 0;padding: 0;width: 33.3333%;"></td><td style="font-size: 12px;font-weight: 300;vertical-align: top;color: rgb(111, 119, 125);margin: 0;padding: 0;width: 33.3333%;"></td></tr></table>',
            category: 'Sections'
          },
          {
            id: '3-7-column',
            label: '3/7 Column',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M2 20h5V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM10 20h12V4H10v16Zm-1 0V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1Z"></path></svg>',
            content: '<table style="height: 150px; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;"><tr><td style="font-size: 12px;font-weight: 300;vertical-align: top;color: rgb(111, 119, 125);margin: 0;padding: 0;width: 30%;"></td><td style="font-size: 12px;font-weight: 300;vertical-align: top;color: rgb(111, 119, 125);margin: 0;padding: 0;width: 70%;"></td></tr></table>',
            category: 'Sections'
          },

          // Blocks
          { id: 'button',
            label: 'Button',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M20 20.5C20 21.3 19.3 22 18.5 22H13C12.6 22 12.3 21.9 12 21.6L8 17.4L8.7 16.6C8.9 16.4 9.2 16.3 9.5 16.3H9.7L12 18V9C12 8.4 12.4 8 13 8S14 8.4 14 9V13.5L15.2 13.6L19.1 15.8C19.6 16 20 16.6 20 17.1V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H8V12H4V4H20V12H18V14H20C21.1 14 22 13.1 22 12V4C22 2.9 21.1 2 20 2Z"/></svg>',
            content: '<a class="button">Button</a>',
            category: 'Blocks'
          },
          {
            id:'divider',
            label: 'Divider',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M21 18H2V20H21V18M19 10V14H4V10H19M20 8H3C2.45 8 2 8.45 2 9V15C2 15.55 2.45 16 3 16H20C20.55 16 21 15.55 21 15V9C21 8.45 20.55 8 20 8M21 4H2V6H21V4Z"/></svg>',
            content: '<table style="width: 100%; margin-top: 10px; margin-bottom: 10px;"><tr><td class="divider"></td></tr></table><style>.divider {background-color: rgba(0, 0, 0, 0.1);height: 1px;}</style>',
            category: 'Blocks'
          },
          {
            id: 'text',
            label: 'Text',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" /></svg>',
            activate: !0,
            content: {
                type: 'text',
                content: 'Insert your text here',
                style: {
                    padding: '10px'
                }
            },
            category: 'Blocks'
          },
          {
            id: 'text-section',
            label: 'Text Section',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" /></svg>',
            content: '<h1 class="heading">Insert title here</h1><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>',
            category: 'Blocks'
          },
          {
            id:'image',
            label: 'Image',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" /></svg>',
            activate: !0,
            content: {
                type: 'image',
                style: {
                    color: 'black'
                }
            },
            category: 'Blocks'
          },
          {
            id: 'quote',
            label: 'Quote',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" /></svg>',
            content: '<blockquote class="quote">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</blockquote>',
            category: 'Blocks'
          },
          {
            id: 'link',
            label: 'Link',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"></path></svg>',
            content: {
                type: 'link',
                content: 'Link',
                style: {
                    color: '#3b97e3'
                }
            },
            category: 'Blocks'
          },
          {
            id: 'link-block',
            label: 'Link Block',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"></path></svg>',
            content: {
                type: 'link',
                editable: !1,
                droppable: !0,
                style: {
                    display: 'inline-block',
                    padding: '5px',
                    'min-height': '50px',
                    'min-width': '50px'
                }
            },
            category: 'Blocks'
          },
          {
            id:'grid-items',
            label: 'Grid Items',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"/></svg>',
            content: '<table class="grid-item-row"><tr><td class="grid-item-cell2-l">'+gridItems+'</td><td class="grid-item-cell2-r">'+gridItems+'</td></tr></table>',
            category: 'Blocks'
          },
          {
            id:'list-items',
            label: 'List Items',
            media: '<svg viewBox="0 0 24 24"><path fill="'+currentColor+'" d="M2 14H8V20H2M16 8H10V10H16M2 10H8V4H2M10 4V6H22V4M10 20H16V18H10M10 16H22V14H10"/></svg>',
            content: listItems + listItems,
            category: 'Blocks'
          }
        ],
      },
      
    });


    // Load selected template
    editor.setComponents(template.html);
    //editor.setStyle(template.css);


    // **Add Close Button to the Top Toolbar**
    editor.Panels.addButton('options', [{
        id: 'apply-builder',
        className: 'fa fa-check', // FontAwesome close icon
        command: () => handleSaveChanges(),
        attributes: { title: 'Apply Changes' },
      },
      {
        id: 'close-builder',
        className: 'fa fa-times', // FontAwesome close icon
        command: () => onClose(), // Call parent function to close
        attributes: { title: 'Close Builder' },
      }
    ]);

// Apply Changes 

// Function to apply internal CSS (inside <style> tag)
const applyInternalCss = (htmlContent, cssContent) => {
  // We'll only add the styles to the <style> tag for the media queries and regular styles.
  const styleTag = `<style>${cssContent}</style>`;
  return htmlContent.replace('<head>', `<head>${styleTag}`);
};

// Helper function to parse CSS into a usable format
const parseCss = (cssText) => {
  const rules = cssText.split('}').filter(rule => rule.trim() !== "");
  const styles = { mediaQueries: {}, regular: {} };

  let currentMediaQuery = null;

  rules.forEach(rule => {
    // Check if the rule is a media query
    if (rule.includes('@media')) {
      currentMediaQuery = rule.split('{')[0].trim();
      styles.mediaQueries[currentMediaQuery] = styles.mediaQueries[currentMediaQuery] || [];
      const properties = rule.split('{')[1].trim();
      styles.mediaQueries[currentMediaQuery].push(properties);
    } else {
      // Regular CSS rule
      const [selector, properties] = rule.split('{').map(str => str.trim());
      const propertyPairs = properties.split(';').map(property => property.trim()).filter(Boolean);

      const propertiesObject = propertyPairs.reduce((acc, property) => {
        const [key, value] = property.split(':').map(str => str.trim());
        acc[key] = value;
        return acc;
      }, {});

      styles.regular[selector] = propertiesObject;
    }
  });

  return styles;
};

const applyInlineStyles = (htmlContent, cssContent) => {
  // Parse the CSS rules
  const cssRules = parseCss(cssContent);

  // Convert HTML string into a DOM object
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Apply inline styles for regular CSS rules
  Object.keys(cssRules.regular).forEach((selector) => {
    const rule = cssRules.regular[selector];
    const elements = doc.querySelectorAll(selector);

    elements.forEach((el) => {
      const inlineStyles = Object.keys(rule)
        .map(key => `${key}: ${rule[key]}`)
        .join('; ');

      // If the element already has a style attribute, append the new styles
      var currentStyles = el.getAttribute('style') || '';
      if(currentStyles != ''){
        currentStyles = currentStyles + ';';
      }
      const newStyles = `${currentStyles} ${inlineStyles}`.trim();

      el.setAttribute('style', newStyles);
    });
  });

  // Add styles for media queries inside a <style> tag
  const styleTag = doc.createElement('style');
  let mediaQueryStyles = '';

  Object.keys(cssRules.mediaQueries).forEach((mediaQuery) => {
    const mediaStyles = cssRules.mediaQueries[mediaQuery].join(' ');
    mediaQueryStyles += `@media ${mediaQuery} { ${mediaStyles} } `;
  });

  // If there are media queries, add them to the style tag
  if (mediaQueryStyles) {
    styleTag.textContent = mediaQueryStyles;
    doc.head.appendChild(styleTag);
  }

  // Serialize the DOM back to a string
  const updatedHtmlContent = doc.body.innerHTML;
  return updatedHtmlContent;
};

// Function to extract media queries from CSS content
const extractMediaQueries = (cssContent) => {
  const mediaQueries = [];
  const regex = /@media[^{]+{([^}]+)}/g;
  let match;

  while ((match = regex.exec(cssContent)) !== null) {
    mediaQueries.push(match[0]); // Entire media query with content
  }

  return mediaQueries;
};

// Modified function to apply both inline styles and media queries in <style> tag
const applyCssWithMediaQueries = (htmlContent, cssContent) => {
  // Apply inline styles
  const cssRules = parseCss(cssContent);
  let updatedHtmlContent = applyInlineStyles(htmlContent, cssContent);

  // Apply media queries in the <style> tag
  const mediaQueries = extractMediaQueries(cssContent);
  if (mediaQueries.length > 0) {
    const styleTag = `<style>${mediaQueries.join(' ')}</style>`;
    updatedHtmlContent = updatedHtmlContent.replace('<head>', `<head>${styleTag}`);
  }

  return updatedHtmlContent;
};

// Handle saving content
const handleSaveChanges = async () => {
  if (!editor) {
    alert('Editor not initialized');
    return;
  }

  // Get the HTML and CSS content from the GrapesJS editor
  const htmlContent = editor.getHtml();
  const cssContent = editor.getCss();

  // Choose whether to apply inline styles or internal styles
  const saveMethod = 'inline'; // or 'internal' for internal CSS
  let finalHtmlContent;

  if (saveMethod === 'inline') {
    finalHtmlContent = applyInlineStyles(htmlContent, cssContent);
  } else {
    finalHtmlContent = applyCssWithMediaQueries(htmlContent, cssContent);
  }

  // Call the parent's callback to pass the updated content
  onApply({finalHtmlContent, cssContent});
  onClose();
};


    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [isVisible]);
  //}, [containerId]); // Dependency array ensures effect runs only when `containerId` changes

  setTimeout(() => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      iframe.contentDocument.body.classList.add('gjs-dashed');
    }
  }, 2000);
  
  return <div id={containerId} style={{ width: '100%', height: '100vh' }}/>

};

export default GrapesJSBuilder;
