import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Button,  Form, Select,Table,Checkbox,message} from 'antd';
import styles from './style.less';
import $ from  'jquery';

let time = null;

const BillTable = ['建设项目造价咨询工作交办单','委托人提供资料交接清单','工程咨询过程资料交接登记表'];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};







//添加样式
function addActiveEvent(position,addClasses){
  $(".ty-transfer-operation").find("."+position).addClass(addClasses);
};
//删除样式
function removeActiveEvent(position,addClasses){
  $(".ty-transfer-operation").find("."+position).removeClass(addClasses);
};


//按钮添加class事件
function checkTagClass(that){
  let parentsTransfer = that.parents(".ty-transfer-list");
  let tagClass = null;
  let tagRemoveClass = null;

  if(parentsTransfer.hasClass("transfer-list-left")){
    tagClass = "ty-transfer-btn-toright"
    tagRemoveClass = "ty-transfer-btn-toleft";
  }else{
    tagClass = "ty-transfer-btn-toleft"
    tagRemoveClass = "ty-transfer-btn-toright";
  }
  return [tagClass,tagRemoveClass];
};

const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class Step2 extends PureComponent {
  state = {
    targetKeys: [],
    BillTableOptionTable:``,
    mockData:[{
      key: '8',
      person: 'John Brown',
      personId: '111111111',
      majorId: "2",
    },{
      key: '9',
      person: 'John Brown',
      personId: '111111111',
      majorId: "3",
    }],
  };

  componentDidMount() {
    //根据用户id 查询当前用户所在的部门，找到部门下面所有的人员
    const currentuser = JSON.parse(localStorage.getItem("user"));
    this.handleBillTableOptionTable();
    this.props.dispatch({
      type: 'person/fetch',
      payload: {
        uid:currentuser.id,
      },
      callback: (res) => {
        if(res.meta.status === '000000' ) {
          const data = res.data;
              const ul = $("#wpersonList");   //获取UL对象
              ul.empty();
              const div = $("#wcount");   //获取div对象
              div.html('');
              div.append("可选人员  "+data.total+"条");
              const list =  data.list;
              for(let i =0;i<list.length;i++){
                let temp =  list[i];
                let username =temp.name;
                let  li = '<div class="LazyLoad is-visible" style="height: 32px;"><li class="ant-transfer-list-content-item">' +
                  '<div class="ty-tree-div" >'
                  +'<span class="tyue-checkbox">'
                  +'<input type="checkbox" class="ant-checkbox-input" id="tyue-checkbox-blue3">'
                  +'<span class="ant-checkbox-inner"></span>'
                  +'<input type="hidden" id= "wuserid" value='+temp.id+'>'
                  +'<input type="hidden" id= "majorId" value='+temp.major+'>'
                  +'<span class="tyue-checkbox-circle"></span></span>'
                  +'<span class="tyue-checkbox-txt" title='+username+'>'+username
                  +'</span>'
                  +'</div>'
                  +'</li></div>';

                ul.append(li);
              }

        }else{
          message.error(res.data.alert_msg);
          return false;
        }
        this.transferInit();

        this.inputClickHz();

      }
    })

  }

   setSearchObj = (that) =>{

     const currentuser = JSON.parse(localStorage.getItem("user"));
    if (that.value != "") {

      this.props.dispatch({
        type: 'person/fetch',
        payload: {
          uid:currentuser.id,
          pinyin:that.value,
        },
        callback: (res) => {
          if(res.meta.status === '000000' ) {
            const data = res.data;
            const ul = $("#wpersonList");   //获取UL对象
            ul.empty();
            const div = $("#wcount");   //获取div对象
            div.html('');
            div.append("可选人员  "+data.total+"条");
            const list =  data.list;
            for(let i =0;i<list.length;i++){
              let temp =  list[i];
              let username =temp.name;
              let  li = '<div class="LazyLoad is-visible" style="height: 32px;"><li class="ant-transfer-list-content-item">' +
                '<div class="ty-tree-div" >'
                +'<label className="ant-checkbox-wrapper">'
                +'<span class="tyue-checkbox">'
                +'<input type="checkbox" class="ant-checkbox-input" id="tyue-checkbox-blue3">'
                +'<span class="ant-checkbox-inner"></span>'
                +'<input type="hidden" id= "wuserid" value='+temp.id+'>'
                +'<input type="hidden" id= "majorId" value='+temp.major+'>'
                +'<span class="tyue-checkbox-circle"></span></span>'
                +'</label>'
                +'<span class="tyue-checkbox-txt" title='+username+'>'+username
                +'</span>'
                +'</div>'
                +'</li></div>';

              ul.append(li);
            }

          }else{
            message.error(res.data.alert_msg);
            return false;
          }

        }
      })

    }
  };


  inputClickHz = ()=> {
    //input焦点
    let input_Focus = $(".ant-input");
    let input_timer = null;

   /* //小图标处理；
    $(".anticon-close-circle").bind('focus', function () {
      // input_Focus.focus().select(0, 0);
      input_Focus.val("");
      $(this).hide();

    });*/
    this.setInput_Focusclick(input_Focus);

    /*$(".anticon-close-circle").on('click', function (e) {
      input_Focus.focus().select(0, 0);
      input_Focus.val("");
      $(this).hide();

    });*/




  };


  setInput_Focusclick =(input_Focus)=>{
    let that = this;
    //搜索框处理；
    input_Focus.bind("blur", function (e) { //失去焦点

      that.setSearchObj(this);
    }).bind("focus", function (e) {//获得焦点时

      /* input_timer = setInterval(function () {
         if (that.value == "") {
           $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-close-circle");
           $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-search");

         } else {
           $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-close-circle");
           $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-search");
         }
       }, 200);*/
      if (this.value == "") {
        $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-close-circle");
        $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-search");
      } else {
        $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-close-circle");
        $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-search");
      }

    }).bind("keydown", function (e) {
      e = e || window.event;
      if (e.keyCode == 8) {
        if (this.value == "") {
          $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-close-circle");
          $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-search");

        }else{
          $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-close-circle");
          $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-search");
        }
      } else {
        if (this.value == "") {
          $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-close-circle");
          $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-search");

        } else {
          $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-close-circle");
          $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-search");
        }

      }

    }).bind("change", function (e) {
      if ($.trim(input_Focus.val()).length > 0) {
        $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").addClass("anticon-close-circle");
        $("#searchhz").find(".ant-transfer-list-search-action").find(".anticon").removeClass("anticon-search");
      }
    });

    //键盘搜索事件
    input_Focus.bind("keypress", function (e) {

      let keycode = e.keyCode;
      let searchName = $(this).val();
      if (keycode == '13') {
        e.preventDefault();
        /*//请求搜索接口
         alert(searchName);*/
        if (this.value != "") {
          that.setSearchObj(that);
        }

      }
    });

  }


  //jquery 穿梭框 改写代码 初始化
  transferInit = () =>{
    // 操作添加和删除按钮 左右移动
    let switchBtn = $(".ty-transfer-operation").find(".to-switch");
    //可选人员的
    let allCheckedBoxes = $(".ty-tree-div").find(".ant-checkbox-input");
    //this.alldivBoxes = this.el.find(".ty-tree-div");


    this.checkBoxEvent(allCheckedBoxes);
    this.switchEvent(switchBtn);
    time = null;
  };


  //按钮切换事件
  switchEvent = (switchBtn)=>{
    const that = this;
    const { mockData } = that.state;
    let arrVal = [];
    switchBtn.on("click",function(){
      const _this = $(this);
      let a_tagClass = null,findCheckbox=null,inputCheckbox=null;
      if(_this.hasClass("ty-transfer-btn-toright")){
        findCheckbox = _this.parents(".ty-transfer").find(".transfer-list-left li");
        inputCheckbox = _this.parents(".ty-transfer").find(".transfer-list-right ul");
        a_tagClass = "ty-transfer-btn-toright";
      }else{
        findCheckbox = _this.parents(".ty-transfer").find(".transfer-list-right li");
        inputCheckbox = _this.parents(".ty-transfer").find(".transfer-list-left ul");
        a_tagClass = "ty-transfer-btn-toleft";
      }
      let checkBox = findCheckbox.find(":checked");
      if(checkBox != 0){
        arrVal = [];
        checkBox.each(function(i){
          $(this).removeAttr("checked");
          $(this).prop('checked',false);
          $(this).parents(".tyue-checkbox").removeClass("ant-checkbox-checked");
          $(this).parents(".tyue-checkbox").parents(".ant-checkbox-wrapper").removeClass("ant-checkbox-wrapper-checked");
          let appendText = $(this).parents(".ty-tree-div").parent("li");
          //arrVal.push(appendText);
          let personId =appendText.find("#wuserid").val();
          let majorId =appendText.find("#majorId").val();
          let name  = appendText.find(".tyue-checkbox-txt").text();

          arrVal.push(
            {
            key: i+1,
            person: name,
            personId: personId,
            majorId: "2",
            }
          );
          removeActiveEvent(a_tagClass,"active");
          addActiveEvent(a_tagClass,"disabled");
        });
        //inputCheckbox.prepend(arrVal);

        that.setState({
          mockData:[...mockData,...arrVal]
        });
        arrVal = [];
        console.info(that.state.mockData);
      }
    });
    // mockData.push(arrVal);

  };



  //所有标签单击选中事件
   checkBoxEvent = (allCheckedBoxes) =>{
    allCheckedBoxes.on("click",function(){
      clearTimeout(time);
      time = setTimeout(function(){
        let classNames = checkTagClass($(this));
        if($(this).is(":checked")){
          $(this).parents(".tyue-checkbox").addClass("ant-checkbox-checked");
          $(this).parents(".tyue-checkbox").parents(".ant-checkbox-wrapper").addClass("ant-checkbox-wrapper-checked");

          removeActiveEvent(classNames[0],"disabled");
          addActiveEvent(classNames[0],"active");
          if(!$("."+classNames[1]).hasClass("active")){
            addActiveEvent(classNames[1],"disabled");
          }
        }else{
          $(this).parents(".tyue-checkbox").removeClass("ant-checkbox-checked");
          $(this).parents(".tyue-checkbox").parents(".ant-checkbox-wrapper").removeClass("ant-checkbox-wrapper-checked");
          let siblingsTag = $(this).parents(".ty-tree-div").parent("li").siblings("li").find(".ant-checkbox-input");
          if(!siblingsTag.is(":checked")){
            removeActiveEvent(classNames[0],"active");
            addActiveEvent(classNames[0],"disabled");
            $(this).parents(".ty-transfer").find(".transfer-all-check").removeAttr("checked","checked")
          }
        }
      }.bind(this),200);

    });
  };


  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  renderItem = (item) => {
    return (
     item.title
    );
  };
  handleBillTableOptionTable = () => {
    const optionData = BillTable.map((data, index) => {
      const val = `${data}`;
      const keyNum = `${index}`;
      return <Option key={keyNum} value={val}>{val}</Option>;
    });
    this.setState({
      BillTableOptionTable: optionData,
    });
  }; // 根据数据中的数据，动态加载业务来源的Option


  handleDeleteTableDate=(record)=>{
    const dataSource = [...this.state.mockData];
       if(record.personId){
         this.setState({ mockData: dataSource.filter(item => item.personId !== record.personId) });
       }
  }

  render() {
    const { person: {data}, form, dispatch, submitting } = this.props;
    const { selectedKeys, BillTableOptionTable ,mockData} = this.state;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/project/projectStart/info'));
    };
   /* const validData = data.data.list;*/
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/submitStepForm',
            payload: {
              ...values,
            },
          });
          dispatch(routerRedux.push('/project/projectStart/result'));
        }
      });
    };

    const columns = [{
      title: '人员姓名',
      dataIndex: 'person',
      key: 'person',
    }, {
      title: '专业',
      dataIndex: 'majorId',
      key: 'majorId',
      render: (text, record) => (
        <Select  value ={record.majorId} allowClear>
          <Option value="0"  >请选择</Option>
          <Option value="1"  >土建</Option>
          <Option value="2" >装饰</Option>
          <Option value ="3" >安装</Option>
          <Option value ="4" >市政</Option>
          <Option value ="5" >绿化</Option>
        </Select>
      ),
    }, {
      title: '工程量编制/审核',
      dataIndex: 'preparationAudit',
      key: 'preparationAudit',
      render: (text, record) => (
        <Checkbox></Checkbox>
      ),
    }, {
      title: '清单编审与套价',
      dataIndex: 'editorPrice',
      key: 'editorPrice',
      render: (text, record) => (
        <Checkbox></Checkbox>
      ),
    }, {
      title: '自校',
      dataIndex: 'self',
      render: (text, record) => (
        <Checkbox></Checkbox>
      ),
    }
      , {
        title: '操作',
        dataIndex: 'self',
        render: (text, record) => (
          <a onClick={()=>this.handleDeleteTableDate(record)}>删除</a>
        ),
      }];


    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm}>
          <div className="fn-left ant-transfer">
            <div className="ty-transfer  ml20" id="ued-transfer-1">
              <div className="fl ty-transfer-list  transfer-list-left ">
                <div className="ty-transfer-list-head" id="wcount">
                  <div className="ty-transfer-list-head">
                    可选人员
                  </div>
                </div>
                <div className="ant-transfer-list-body ant-transfer-list-body-with-search">
                  <div className="ant-transfer-list-body-search-wrapper">
                    <div id = "searchhz">
                      <input className="ant-input ant-transfer-list-search" placeholder="请输入拼音码" />
                      <span className="ant-transfer-list-search-action">
                              <i className="anticon anticon-search"></i> {/* anticon anticon-close-circle*/}
                      </span>

                    </div>
                  </div>
                  <ul className="ant-transfer-list-content" id="wpersonList">

                  </ul>
                </div>

              </div>
              <div className="fl ty-transfer-operation">
                  <span className="ty-transfer-btn-toright to-switch disabled" >
                  </span>
                <span className="ty-transfer-btn-toleft to-switch disabled">
                  </span>
              </div>
              <div className="fl ty-transfer-list transfer-list-right">
                <div className="ty-transfer-list-head">
                  已选人员
                </div>
                <div className="ty-transfer-list-body ">
                  <ul className="ant-transfer-list-content " id="wpersonList">
                    <Table
                      pagination={false}
                      dataSource={mockData}
                      columns={columns}
                    />
                  </ul>
                </div>

              </div>
              <div className="clearboth">
              </div>

            </div>
          </div>
            {/*<Button style={{ left: 400 }}>
              上一步
            </Button>*/}
            <Button type="primary" onClick={onValidateForm} loading={submitting} style={{ marginLeft: 8,  left: 400 }}>
              保存
            </Button>
        </Form>
      </div>
    );
  }
}

export default connect(({ person, loading }) => ({
  person,
  loading: loading.models.person,
}))(Step2);
