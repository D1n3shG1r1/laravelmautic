import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
//import 'grapesjs-preset-webpage';

const GrapesJSBuilder = ({ containerId, apiUrl }) => {
  const editorRef = useRef(null);
  const currentColor = '#e5e7eb';
  var gridItems = '<table class="grid-item-card"><tr><td class="grid-item-card-cell"><img class="grid-item-image" src="https://via.placeholder.com/250x150/78c5d6/fff/" alt="Image"/><table class="grid-item-card-body"><tr><td class="grid-item-card-content"><h1 class="card-title">Title here</h1><p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p></td></tr></table></td></tr></table>';

  var listItems = '<table class="list-item"><tr><td class="list-item-cell"><table class="list-item-content"><tr class="list-item-row"><td class="list-cell-left"><img class="list-item-image" src="https://via.placeholder.com/150/78c5d6/fff" alt="Image"/></td><td class="list-cell-right"><h1 class="card-title">Title here</h1><p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p></td></tr></table></td></tr></table>';
  
  useEffect(() => {
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
      storageManager: false,
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'Desktop', width: '' },
          { id: 'tablet', name: 'Tablet', width: '768px' },
          { id: 'mobile', name: 'Mobile', width: '375px' }
        ],
      },
      /*plugins: ['gjs-preset-webpage'],
      pluginsOpts: {
        'gjs-preset-webpage': {}
      },*/
      plugins: [grapesjsPresetWebpage], // Use imported plugin
      pluginsOpts: {
        grapesjsPresetWebpage: {}
      },
      /*canvas: {
        styles: [
          'body { background-color: #fff; }',
          '[data-gjs-type="wrapper"] { width: 100%; max-width: 100%; min-height: 100vh; }',
          '.gjs-dashed { border: 1px dashed #ccc; }'
        ]
      },*/
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
      //commands and panels
      /*panels: {
        defaults: [
          {
            id: 'devices-c',
            buttons: [{
                id: 'device-desktop',
                command: 'set-device-desktop',
                active: !0,
                label: '<svg style="display: block; max-width: 22px" viewBox="0 0 24 24"><path fill="currentColor" d="M21 16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3 18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z" /></svg>'
            }, {
                id: 'device-tablet',
                command: 'set-device-tablet',
                label: '<svg style="display: block; max-width: 22px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,18H5V6H19M21,4H3C1.89,4 1,4.89 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6C23,4.89 22.1,4 21,4Z" /></svg>'
            }, {
                id: 'device-mobile',
                command: 'set-device-mobile',
                label: '<svg style="display: block; max-width: 22px" viewBox="0 0 24 24"><path fill="currentColor" d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z" /></svg>'
            },]},
          
            {
              id: 'options',
              buttons: [{
                  id: 'sw-visibility',
                  command: 'sw-visibility',
                  context: 'sw-visibility',
                  label: '<svg style="display: block; max-width: 22px" viewBox="0 0 24 24"><path fill="currentColor" d="M15,5H17V3H15M15,21H17V19H15M11,5H13V3H11M19,5H21V3H19M19,9H21V7H19M19,21H21V19H19M19,13H21V11H19M19,17H21V15H19M3,5H5V3H3M3,9H5V7H3M3,13H5V11H3M3,17H5V15H3M3,21H5V19H3M11,21H13V19H11M7,21H9V19H7M7,5H9V3H7V5Z" /></svg>'
              }, {
                  id: 'preview',
                  context: 'preview',
                  command: 'preview',
                  label: '<svg style="display: block; max-width: 22px" viewBox="0 0 24 24"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"></path></svg>'
              }, {
                  id: 'fullscreen',
                  command: 'fullscreen',
                  context: 'fullscreen',
                  label: '<svg style="display: block; max-width: 22px" viewBox="0 0 24 24"><path fill="currentColor" d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" /></svg>'
              }, {
                  id: 'export-template',
                  command: 'export-template',
                  label: '<svg style="display: block; max-width: 22px" viewBox="0 0 24 24"><path fill="currentColor" d="M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12Z" /></svg>'
              }
            ]
          }
        ]
      }*/
    });

    // Define commands for switching devices
/*
    function updateActiveDeviceButton(deviceId) {
      console.log("Switching to:", deviceId);
  
      // Delay execution to ensure elements exist
      setTimeout(() => {
          const activeBtn = document.querySelector(`[data-device="${deviceId}"]`);
          if (activeBtn) {
              console.log("Active button found:", activeBtn);
              document.querySelectorAll('.gjs-pn-btn').forEach((btn) => {
                  btn.classList.remove('gjs-pn-active', 'gjs-four-color');
              });
              activeBtn.classList.add('gjs-pn-active', 'gjs-four-color');
          } else {
              console.error("Button not found for device:", deviceId);
          }
      }, 1000); // Delay to ensure elements exist
    }
    
    // Hook into GrapesJS event
    editor.on('run:set-device-desktop', () => updateActiveDeviceButton('desktop'));
    editor.on('run:set-device-tablet', () => updateActiveDeviceButton('tablet'));
    editor.on('run:set-device-mobile', () => updateActiveDeviceButton('mobile'));
    
    // Fix device names & ensure buttons update correctly
    editor.Commands.add('set-device-desktop', {
        run: function (editor) {
            editor.setDevice('desktop');
            //updateActiveDeviceButton('desktop');
        }
    });
    
    editor.Commands.add('set-device-tablet', {
        run: function (editor) {
            editor.setDevice('tablet');
            //updateActiveDeviceButton('tablet');
        }
    });
    
    editor.Commands.add('set-device-mobile', {
        run: function (editor) {
            editor.setDevice('mobile');
            //updateActiveDeviceButton('mobile');
        }
    });
    */
  }, [containerId]); // Dependency array ensures effect runs only when `containerId` changes

  /*setTimeout(() => {
    const blockCategories = editor.BlockManager.getCategories();
    blockCategories.each(category => {
      if (category.get('id') === 'Basic') {
        category.set('open', false);
        category.set('visible', false);
      }
    });
  }, 500);*/

  /*setTimeout(() => {
    if (!editor || !editor.BlockManager) {
      console.error("Editor or BlockManager is not initialized yet.");
      return;
    }
  
    const blockCategories = editor.BlockManager.getCategories();
    blockCategories.each(category => {
      if (category.get('id') === 'Basic') {
        category.set('open', false);
        category.set('visible', false);
      }
    });
  }, 500);*/

  setTimeout(() => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      iframe.contentDocument.body.classList.add('gjs-dashed');
    }
  }, 2000);
  
  return <div id={containerId} />

};

export default GrapesJSBuilder;
