// Generates random string ID like "2147483648" for each span in a trace.
const newSpanID = () => Math.floor(Math.random() * 2 ** 31).toString();
const traceID = newSpanID();

export default class Tracing {

 sendSpan(spanName, metadata, duration, isRootSpan) {
   const params = {
     name: spanName,
     service_name: metadata.serviceName,
     duration_ms: duration,
     "trace.trace_id": traceID,
    
     // If no parent ID is passed, just attach to the root span
     "trace.parent_id": isRootSpan ? null : (metadata.parentID || traceID),
     "trace.span_id": isRootSpan ? traceID : newSpanID(),
    
     // Send the current state of all feature flags with each span
     ...flags,
    
     // Send the rest of our fields
     ...metadata,
   };

   // Use the Beacon API to send spans to our proxy endpoint, so we don't
   // have to worry about missing spans if the user navigates while sending.
   navigator.sendBeacon(`/create_span/`, JSON.stringify(params));
 }
}
// then, you’ll need to add code to create your span on page load. It not only adds an on-load listener to create and send the event, but also handles capturing some client metadata and performance data about the current page.

// Start a trace every time someone loads a Honeycomb page in the browser,
// and capture perf stats about the current page load.
// Assumes the presence of a `window.performance.timing` object
const pageLoadMetadata = function() {
 const nt = window.performance.timing;
 const hasPerfTimeline = !!window.performance.getEntriesByType;
 totalDurationMS = nt.loadEventEnd - nt.connectStart;

 const metadata = {
   // Chrome-only (for now) information on internet connection type (4g, wifi, etc.)
   // https://developers.google.com/web/updates/2017/10/nic62
   connection_type: navigator.connection && navigator.connection.type,
   connection_type_effective: navigator.connection && navigator.connection.effectiveType,
   connection_rtt: navigator.connection && navigator.connection.rtt,

   // Navigation timings, transformed from timestamps into deltas (shortened)
   timing_unload_ms: nt.unloadEnd - nt.navigationStart,
   timing_dns_end_ms: nt.domainLookupEnd - nt.navigationStart,
   timing_ssl_end_ms: nt.connectEnd - nt.navigationStart,
   timing_response_end_ms: nt.responseEnd - nt.navigationStart,
   timing_dom_interactive_ms: nt.domInteractive - nt.navigationStart,
   timing_dom_complete_ms: nt.domComplete - nt.navigationStart,
   timing_dom_loaded_ms: nt.loadEventEnd - nt.navigationStart,
   timing_ms_first_paint: nt.msFirstPaint - nt.navigationStart, // Nonstandard IE/Edge-only first pain

   // Entire page load duration
   timing_total_duration_ms: totalDurationMS,
  
   // Client properties
   user_agent: window.navigator.userAgent,
   window_height: window.innerHeight,
   window_width: window.innerWidth,
   screen_height: window.screen && window.screen.height,
   screen_width: window.screen && window.screen.width,
 };

 // PerformancePaintTiming data (Chrome only for now)
 if (hasPerfTimeline) {
   let paints = window.performance.getEntriesByType("paint");

   // Loop through array of two PerformancePaintTimings and send both
   _.each(paints, paint => {
     if (paint.name === "first-paint") {
       metadata.timing_first_paint_ms = paint.startTime;
     } else if (paint.name === "first-contentful-paint") {
       metadata.timing_first_contentful_paint_ms = paint.startTime;
     }
   });
 }

 // Redirect Count (inconsistent browser support)
 metadata.redirect_count =
   window.performance.navigation && window.performance.navigation.redirectCount;

 return metadata;
};

window.addEventListener("load", () => {
   _userEvents.pageLoad(pageLoadMetadata(), totalDurationMS);
});