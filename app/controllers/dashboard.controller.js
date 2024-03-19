const mongoose = require('mongoose');
const pageName = 'dashboard';
const { userslist } = require('../utils/dashboardActions');

exports.dashboardDataList = async (req, res) => {
    console.log('test1')
    const session = await mongoose.startSession();
    session.startTransaction();
    let userDetails = "";
    try {
      const {usersListquery} = req.body;
      const userResult = await Promise.all([
        userslist(
          {
            usersListquery, session
          }
        ),
      ]);
      
      const failedTxns = userResult.filter((result) => result.status !== true);
      if (failedTxns.length) {
        const errors = failedTxns.map(a => a.message);
        await session.abortTransaction();
        return res.status(400).json({
          status: false,
          message: errors
        })
      } else {
        if(userResult[0].status == true) {
            let tempUserData = userResult[0].data;
            let all_membersData = [];
            let aClass_Male_members = 0;
            let aClass_Male_membersData = [];
            let aClass_female_members = 0;
            let aClass_female_membersData = [];
            let bClass_Male_members = 0;
            let bClass_Male_membersData = [];
            let bClass_female_members = 0;
            let bClass_female_membersData = [];
            let cClass_Male_members = 0;
            let cClass_Male_membersData = [];
            let cClass_female_members = 0;
            let cClass_female_membersData = [];
            if(tempUserData.length > 0) {
                tempUserData.map(item => {
                    if(item.memberType == 'a-class' && item.gender == 'male'){
                      if(item.status == 'active'){
                        aClass_Male_members = aClass_Male_members + 1;
                      }
                      aClass_Male_membersData.push(item);
                    } else if(item.memberType == 'a-class' && item.gender == 'female'){
                      if(item.status == 'active'){
                        aClass_female_members = aClass_female_members + 1;
                      }
                      aClass_female_membersData.push(item);
                    } else if(item.memberType == 'b-class' && item.gender == 'male'){
                      if(item.status == 'active'){
                        bClass_Male_members = bClass_Male_members + 1;
                      }
                      bClass_Male_membersData.push(item);
                    } else if(item.memberType == 'b-class' && item.gender == 'female'){
                      if(item.status == 'active'){
                        bClass_female_members = bClass_female_members + 1;
                      }
                      bClass_female_membersData.push(item);
                    } if(item.memberType == 'c-class' && item.gender == 'male'){
                      if(item.status == 'active'){
                        cClass_Male_members = cClass_Male_members + 1;
                      }
                      cClass_Male_membersData.push(item);
                    } else if(item.memberType == 'c-class' && item.gender == 'female'){
                      if(item.status == 'active'){
                        cClass_female_members = cClass_female_members + 1;
                      }
                      cClass_female_membersData.push(item);
                    }
                    //if(item.status == 'active'){
                      all_membersData.push(item);
                    //}
                });
            }
            var tempArray = {
                aClass_Male_members:aClass_Male_members.toString(),
                aClass_female_members:aClass_female_members.toString(),
                bClass_Male_members:bClass_Male_members.toString(),
                bClass_female_members:bClass_female_members.toString(),
                cClass_Male_members:cClass_Male_members.toString(),
                cClass_female_members:cClass_female_members.toString(),

                aClass_Male_membersData:aClass_Male_membersData,
                aClass_female_membersData:aClass_female_membersData,
                bClass_Male_membersData:bClass_Male_membersData,
                bClass_female_membersData:bClass_female_membersData,
                cClass_Male_membersData:cClass_Male_membersData,
                cClass_female_membersData:cClass_female_membersData,
                all_membersData:all_membersData
            }
            userDetails = tempArray
        }
      }
      await session.commitTransaction();
      session.endSession();
  
      return res.status(200).json({
        userDetails
      })
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
  
      return res.status(500).json({
        status: false,
        message: `Unable to find perform transfer. Please try again. \n Error: ${err}`
      })
    }
}