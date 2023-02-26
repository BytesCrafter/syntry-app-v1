import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit, OnDestroy {

  isLoading: any = true;
  public members: any[] = [];

  curTab: any;
  tabList: any[] = [];

  activeHeads: any[] = [];
  activeMembers: any[] = [];

  constructor(
    private api: ApiService,
    private util: UtilService
  ) { }

  getInstance(id: any) {
    if(!this.tabList?.length) {
      return false;
    }

    return this.tabList.find(x => x.id == id);
  }

  onChangeTab(id) {
    const instance = this.getInstance(id);
    if(instance) {
      this.activeHeads = instance.heads;
      this.activeMembers = instance.members;
    }
  }

  ngOnInit() {

    this.isLoading = true;
    this.api.posts('departments/list', {}).then((res: any) => {

      if(res && res.success === true && res.data) {
        this.curTab = res.data.length ? res.data[0].id:0;
        res.data.forEach(tabs => {
          this.tabList.push({
            id: tabs.id,
            name: tabs.title,
            heads: tabs.heads,
            members: tabs.members
          });
        });

        // this.tabList.forEach( item => {
        //   item.heads.forEach( head => {
        //     this.api.posts('departments/list', {}).then((res: any) => {
        //       if(res && res.success === true && res.data) {
        //         head.clockin = "aaa";
        //       }
        //     })
        //   })
        //   item.members.forEach( member => {
        //     this.api.posts('departments/list', {}).then((res: any) => {
        //       if(res && res.success === true && res.data) {
        //         member.clockin = "aaa";
        //       }
        //     })
        //   })
        // })
        // Calling the DT trigger to manually render the table
        //this.dtTrigger.next();
      } else {

      }
    }).catch(error => {
      this.util.modalAlert('Error', 'Something went wrong!');
      console.log('error', error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    //this.dtTrigger.unsubscribe();
  }

}
