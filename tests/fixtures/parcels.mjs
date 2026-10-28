// SYNTHETIC TEST FIXTURE ONLY. Never import into production data.
export function parcelFixture(today=new Date().toISOString().slice(0,10)){
 return {schema:'klure.parcels.v1',type:'FeatureCollection',features:[{
 type:'Feature',id:'synthetic-taiping',properties:{
 site:'taiping',kind:'cadastral',label:'SYNTHETIC TEST PARCEL — not a real boundary',
 sourceType:'OFFICIAL_CADASTRAL',sourceUrl:'https://example.com/synthetic',reference:'SYNTHETIC fixture, no official document',checked:today,confidence:'LOW',
 rights:{status:'permitted',reference:'Synthetic test geometry only'},
 review:{status:'reviewed',date:today,role:'surveyor',siteMatch:'confirmed',note:'Synthetic QA fixture; no actual survey or site match'},
 sourceAreaSqm:1000,controls:[{label:'SYNTHETIC context',value:'Example text only; no planning entitlement',sourceType:'OFFICIAL_PLANNING',sourceUrl:'https://example.com/planning',reference:'Synthetic context reference',checked:today,scope:'area_context',reviewed:false}]},
 geometry:{type:'Polygon',coordinates:[[[101.705,3.165],[101.706,3.165],[101.706,3.166],[101.705,3.166],[101.705,3.165]]]}}]};
}
