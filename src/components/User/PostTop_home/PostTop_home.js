import React, { Component,useEffect } from "react";
import Tinh from "./TinhThanh.json";
import style from './PostTop_home.module.css'
import baiPost from './Top10post.json'
import top5 from './Top5.json'
import ReactPaginate from 'react-paginate'
import axios from 'axios';


export default class PostTop_home extends Component {

  
  constructor(props) {
    super(props)

    this.state = {
        offset: 0,
        tableData: [],
        orgtableData: [],
        perPage: 6,
        currentPage: 0,
        country:[],
        aWard:[],
        isFull:true,
        isPar:true,
        selectValue: ""

        
    }
    this.handlePageClick = this.handlePageClick.bind(this);
    this.submit = this.submit.bind(this);
    this.onChangePart = this.onChangePart.bind(this);
    this.onChangeFul = this.onChangeFul.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);


}

handleDropdownChange(e) {


  this.setState({ selectValue: e.target.value });
  console.log(this.state.selectValue)
}

handlePageClick = (e) => {

    const selectedPage =e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
        currentPage: selectedPage,
        offset: offset
    }, () => {
        this.loadMoreData()
    });

};

loadMoreData() {
const data = this.state.orgtableData;

const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
this.setState({
  pageCount: Math.ceil(data.length / this.state.perPage),
  tableData:slice,
  
})

}

componentDidMount(){
    this.getData();
    this.getProvince();
    this.getAwardEmp();

}


  renderTinh = () => {
  
    return this.state.country.map((tenTinh, index) => {
      return <option style={{width: "150px"}}>{tenTinh.province_name}</option>;
    });
  };

  getData() {
    axios
        .get(`https://mocki.io/v1/fa93f59a-2be6-48fb-8c83-a93719bd2191`)
        .then(res => {
         
          var data = res.data;
          var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
          this.setState({
              pageCount: Math.ceil(data.length / this.state.perPage),
              orgtableData :res.data,
              tableData:slice,
              
          })
      });
}


getProvince() {
  axios
      .get(`https://vapi.vnappmob.com/api/province`)
      .then(res => {
      
        var data = res.data.results;
    
        this.setState({
          country:data

        })
    });
}

getAwardEmp() {
  axios
      .get(`https://mocki.io/v1/d58c1e96-a19c-4b30-9bdb-49a51ddd4a2a`)
      .then(res => {
        var data = res.data;
     
        this.setState({
          aWard:data
        })
    });
}


  renderPost = () =>{
    return this.state.tableData.map((post,index) => { 

      return (
   
        <div className="media border p-1 mt-1 mb-1" key={index}>
          <div className="media-body">
            <h5  style={{color:'#203181'}}>{post.tenChuNha} | <span className="badge badge-light"> Hình thức:{post.hinhThuc}</span> | <span className="badge badge-light"> Lương: {post.salary}</span>  <span className="badge badge-info" >{post.diaChi}</span> </h5>
            <p className='text-break' style={{fontSize:'15px'}}> <b>Nội dung:</b> {post.Content.substr(0,190)} <a className='text-primary ' style={{textDecoration:'none' ,cursor:'pointer'}}>  Xem thêm...</a></p>
            <small style={{paddingRight:'60px'}}><i className='text-secondary'>Được đăng lúc:{post.timePost}</i></small>
          </div>
          <img src={post.imgProfile} alt="true" className="ml-2 mt-3 rounded-circle" style={{width:'70px',height:'80px'}} />
      
      
       </div>
      



      )
    }) 
  } 

  renderTop5 = () => {

    return this.state.aWard.map((top,index) => {
     var start= top.diemDanhGia;
     var indents = [];
for (var i = 0; i < start; i++) {
  indents.push( <i className="fa fa-star" style={{color:'#ffc800'}}></i>);
}
      return (
        
        <div className="media border p-1  mt-1 mb-1" key={index}>
        <div className="media-body">
          <h5  style={{color:'#203181'}}> {top.tenUngVien} | <span className="badge badge-light"> {top.tuoi} Tuổi </span>  </h5>
        
             <span className="badge badge-info" >{top.diaChi}</span>
             <span className="badge badge-light ml-3"> Lượt thuê:{top.luotThue}</span>
              <br/>
              <br/>


               <div className='row pl-3 pt-2 col-5'>
               {indents}
               
                             
               <div type="button" className={style.buttonPT} > <i className="fa fa-arrow-right col-2"></i> Tuyển dụng</div>
               </div>

               </div>
   
        <img src='https://toplist.vn/images/800px/kamiwedding-316252.jpg' alt="true" className="ml-2 mt-3 rounded-circle" style={{width:'70px',height:'80px'}} />
   </div>
      )
    })
  }

  submit(e){
    e.preventDefault()
    console.log(this.state.isFull,this.state.isPar);   

  

console.log("currentrpage" ,this.state.currentPage)
    axios
    .get(`https://mocki.io/v1/fa93f59a-2be6-48fb-8c83-a93719bd2191`)
    .then(res => {
     
      var data = res.data;
      var found;
      var search;

   if(this.state.isFull && !this.state.isPar){
    if(this.state.selectValue != null){
      found = data.filter(element =>{return element.Tinh === this.state.selectValue && element.hinhThuc === 'Full Time' })
     console.log("found",found)
     var slice = found.slice(this.state.offset, this.state.offset + this.state.perPage)
       this.setState({
           pageCount: Math.ceil(found.length / this.state.perPage),
           orgtableData :found,
           tableData:slice
         })

   }else{
      
      search=data.filter(filter => {
       return filter.hinhThuc === 'Full Time'})
       console.log("fullsssssssssssss",search)
      var slice = search.slice(this.state.offset, this.state.offset + this.state.perPage)
      this.setState({
          pageCount: Math.ceil(search.length / this.state.perPage),
          orgtableData :search,
          tableData:slice,

          
      })
    }
    }else if(this.state.isPar && !this.state.isFull){
  
      if(this.state.selectValue != null){
        found = data.filter(element =>{return element.Tinh === this.state.selectValue && element.hinhThuc === 'Part Time'})
       console.log("found",found)
       var slice = found.slice(this.state.offset, this.state.offset + this.state.perPage)
         this.setState({
             pageCount: Math.ceil(found.length / this.state.perPage),
             orgtableData :found,
             tableData:slice
           })
 
     }else{

        search=data.filter(filter => {
         return filter.hinhThuc === 'Part Time'})
         console.log("part",search)
        var slice = search.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(search.length / this.state.perPage),
            orgtableData :search,
            tableData:slice,
        
                     
        })}

    }else if(this.state.isPar && this.state.isFull){
       console.log("cuoizzzzz")
      if(this.state.selectValue != ""){
        console.log("ss",this.state.selectValue)
       found = data.filter(element =>{return element.Tinh === this.state.selectValue})
      console.log("found",found)
      var slice = found.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(found.length / this.state.perPage),
            orgtableData :found,
            tableData:slice
          })
        }
        else{
          console.log("hehehehheh")
          console.log(data)
          this.handlePageClick();
          var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
          this.setState({
              pageCount: Math.ceil(data.length / this.state.perPage),
              orgtableData :data,
              tableData:slice
            })}
    }else if(!this.state.isPar && !this.state.isFull){

      if(this.state.selectValue != null){
        found = data.filter(element =>{return element.Tinh === this.state.selectValue})
       console.log("123",found)
       var slice = found.slice(this.state.offset, this.state.offset + this.state.perPage)
         this.setState({
             pageCount: Math.ceil(found.length / this.state.perPage),
             orgtableData :found,
             tableData:slice
           })
          }
else{
        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            orgtableData :res.data,
            tableData:slice
          })
    
        }
      }      
      console.log("currenrpaeg",this.state.currentPage);
    console.log("data",this.state.orgtableData);
  })
  
  
  
  
  
  /* if({tableData:this.state.tableData.map(filter => filter.hinhThuc=="Full Time")})
  {
    this.setState({tableData:this.state.tableData.map(filter => filter.value)});
  }*/
  
  }
   
  
  /* 
  submit(e){
    e.preventDefault()
    {this.handleChange(e)};
    console.log("sss",this.state.country);
  } */
   

  onChangeFul = () => {
    this.setState(initialState => ({
      isFull: !initialState.isFull,
    }));
  }

  onChangePart = () => {
    this.setState(initialState => ({
      isPar: !initialState.isPar,
    }));
  }



  render() {
   
    return (
      <div className="container-fluid">
        <div className="row  w-100 pb-3">
          <div className="col-2 text-center border border-right-0 filter" style={{ width: "300%" }}>
             <form  onSubmit={this.submit}  style={{ paddingTop: "10%" ,marginTop:'80px' }} className='border'>
                  <div style={{ width: "500%" }}>
                <div className="form-check-inline ">
                  <label className="form-check-label" htmlFor="check1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="check1"
                      name="isFull"
                      checked={this.state.isFull}
                      onChange={this.onChangeFul}

                 
                      defaultValue="something1"
                      comingsoon="false"
                      value="1"
                    />
                    Full Time
                  </label>
                </div>
                <div className="form-check-inline">
                  <label className="form-check-label" htmlFor="check2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="check2"
                      name="isPar"
                      checked={this.state.isPar}
                      onChange={this.onChangePart}
                      defaultValue="something2"
                      value="1"
                    />
                    Part Time
                  </label>
                </div>
              </div>
            
              <div className="form-group"></div>
            
              <div style={{ width: "250%", padding: "20px 0 20px 0" }}>
                <label htmlFor="sel1">Tỉnh thành:</label> 
                <select className="form-control " id="sel1" name="sellist1" onChange={this.handleDropdownChange}>
                  <option selected hidden>Chọn tỉnh :</option>
                  {this.renderTinh()}
                </select>
              </div>

              <button  type="submit" className="btn btn-primary"  >
                Tìm kiếm
              </button>
              
            </form> 


            


          </div>
          <div className="col-7 border border-left-0">
          <h2 className="p-3 text-center" style={{color:'#203181'}} >TOP BÀI ĐĂNG MỚI NHẤT</h2>
              {this.renderPost()}

            
         
          </div>
          
          <div className="col-3 border">
             <h4 className="p-3 mb-4 text-center" style={{color:'#203181'}} >TOP 5 ỨNG VIÊN XUẤT SẮC</h4>
             {this.renderTop5()}
            
          </div>
          <div>
          <ReactPaginate
      previousLabel={"prev"}
      nextLabel={"next"}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={this.state.pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={this.handlePageClick}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}/>
          </div>
        </div>
      </div>
    );
  }

 }



