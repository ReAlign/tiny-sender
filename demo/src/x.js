import TinySender from "./../../dist/tiny-sender.module";

const blockAfter = async (o) => {
  const {
    json,
    TS,
  } = o;

  if(json.code === 200) {
    TS.Notify.success('sss');
  }

  return json;
};

export default TinySender.getIt({ blockAfter, });
