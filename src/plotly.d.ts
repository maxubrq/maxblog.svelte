// The prebuilt Plotly bundles ship no types of their own; they are the same API.
declare module "plotly.js-dist-min" {
  import Plotly from "plotly.js";
  export default Plotly;
}
declare module "plotly.js-basic-dist-min" {
  import Plotly from "plotly.js";
  export default Plotly;
}
