## User Activity Tracking recipe
This recipe intend to provide an example on tracking user activities using a custom service that receiving messages triggered by certain user activities.
The following user activity will be tracked in this recipe.
- Opening a PDF
- Click "Follow" and "Unfollow" button.

Use the following page to view the activity records.
http://localhost:3375/components/ActivityList/ActivityList.html

## Prerequisite
MongoDB is used in this recipe to store the activity records.
You can modify the Mongo DB url in server/server.js line 168.