import React, { useEffect, useState } from 'react';
import '../Css/HomeAdmin.css';
import { Card, Form, Button, FormControl, Row, Dropdown, Modal } from 'react-bootstrap';
import { BsThreeDots, BsQuestionSquare } from 'react-icons/bs';
import { AiOutlinePrinter } from 'react-icons/ai';
import Product from './ItemProductBill';
import { getPriceVND } from '../Contain/getPriceVND';
import * as FetchAPI from '../Utils/FetchAPI';
import { link } from '../Utils/Link';

export default function OrderAdmin() {
    let id = 0;
    const [rows, setRows] = useState([]);
    const [rowsFull, setRowsFull] = useState([]);
    const [idhoadon, setIdhoadon] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);
    const [deletePayment, setDeletePayment] = useState(false);
    const handleClose = () => setShowPayment(false);
    const handleCloseDelivery = () => setShowDelivery(false);
    const handleShow = () => setShowPayment(true);
    const handleShowDelivery = () => setShowDelivery(true);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const [dataItem, setDataItem] = useState([]);
    const [arrFood, setArrFood] = useState([]);
    const [showModalCustomer, setShowModalCustomer] = useState(false);
    const handleCloseModalCustomer = () => setShowModalCustomer(false);
    const handleShowModalCustomer = () => setShowModalCustomer(true);
    const [inforCustomer, setInforCustomer] = useState([]);
    const [varTempShowCustomer, setVarTempShowCustomer] = useState(false);
    function createData(MaHD, Date, Status, Customer, TongTien, DateCom, MangFood) {
        id += 1;
        return { id, MaHD, Date, Status, Customer, TongTien, DateCom, MangFood };
    }
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            style={{ color: 'black' }}
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </a>
    ));
    async function getBill() {
        try {
            let mang = [];
            const res = await FetchAPI.getDataApi(link + "getFullBill.php");
            res.sort((a, b) =>
                b.datedat.split('/').reverse().join().localeCompare(a.datedat.split('/').reverse().join()));
            for (var i = 0; i < res.length; i++) {
                mang = mang.concat(
                    createData(
                        res[i].idhoadon,
                        res[i].datedat,
                        res[i].status,
                        res[i].iduser,
                        res[i].tongtien,
                        res[i].datethanhtoan,
                        res[i].mangmonan,
                    )
                )
            }
            setRows(mang);
            setRowsFull(mang);
        } catch (error) {
        }

    }
    useEffect(() => {
        getBill();
    }, [])

    function setIconStatus(i) {
        if (i == 0) {
            return (
                <p style={{ color: 'white', backgroundColor: 'red', marginTop: '15px' }}>??ang x??? l??</p>
            )
        } else if (i == 1) {
            return (
                <p style={{ color: 'gray', backgroundColor: 'yellow', marginTop: '15px' }}>??ang giao</p>
            )
        } else {
            return (
                <p style={{ color: 'white', backgroundColor: 'green', marginTop: '15px' }}>???? giao th??nh c??ng</p>)
        }
    }
    function updateSearch(search) {
        let newDataF = [];
        rowsFull.map((e) => {
            if (e.MaHD.indexOf(search.target.value) !== -1) {
                newDataF.push(e)
            }
        })
        setRows(newDataF);
    }
    const elements = arrFood.map((item, type) => {
        return (
            <Product
                ten={item.ten}
                hinhanh={item.hinhanh}
                gia={getPriceVND(item.gia) + " ?? / 1 ph???n"}
                soluong={item.soluong}
                id={item.id}
                tong={item.soluong * item.gia}
            />
        )
    }, []);
    async function handleUpdateStatis() {
        const res = await FetchAPI.postDataApi(link + "updatethongke.php", { "IDHOADON": idhoadon })
        console.log(res)
    }
    async function HandlePayment() {
        try {
            const data = { "IDHOADON": idhoadon };
            const res = await FetchAPI.postDataApi(link + "setStatusBill.php", data);
            if (res.result == "successfully") {
                setShowPayment(false);
                handleUpdateStatis();
                window.location.reload();
            }
            else if (res.result == "error") {
                console.log("Th???t b???i")
            }
        } catch (error) {

        }
    }
    async function HandleDelivery() {
        try {
            const data = { "IDHOADON": idhoadon };
            const res = await FetchAPI.postDataApi(link + "setStatusBillDelivery.php", data);
            if (res.result == "successfully") {
                setShowDelivery(false);
                handleUpdateStatis();
                window.location.reload();
            }
            else if (res.result == "error") {
                console.log("Th???t b???i")
            }
        } catch (error) {

        }
    }
    async function DeletePayment() {
        try {
            const data = { "IDHOADON": idhoadon };
            console.log('Id hoa don', data)
            const res = await FetchAPI.postDataApi(link + "removeBill.php", data);
            if (res.result == "successfully") {
                setDeletePayment(false);
                handleUpdateStatis();
                window.location.reload();
            }
            else if (res.result == "error") {
                console.log("Th???t b???i")
            }
        } catch (error) {

        }
    }

    async function handleFood(arr) {
        try {
            let x = JSON.parse(arr);
            let arrtemp = [];
            for (var i = 0; i < x.length; i++) {
                const data = {
                    "IDMONAN": x[i].id,
                    "SOLUONG": x[i].soluong
                }
                const res = await FetchAPI.postDataApi(link + "getMonAnById.php", data);
                arrtemp.push(res);
            }
            setArrFood(arrtemp);
            handleShowModal();
            window.scroll(0, 0);
        } catch (error) {

        }
    }
    async function getCustomer(id) {
        try {
            const data = { "ID": id };
            const res = await FetchAPI.postDataApi(link + "getUserById.php", data);
            setInforCustomer(res);
            handleShowModalCustomer();
            handleCloseModal();
        } catch (error) {
            console.log("L???i t??m lum " + error)
        }
    }
    function handlePrintBill() {

        let content = document.getElementById('printarea');
        let totalBill = document.getElementById('totalBill');
        let name = document.getElementsByClassName('BillName');
        let price = document.getElementsByClassName('BillPrice');
        let amount = document.getElementsByClassName('BillAmount');
        let pri = document.getElementById('ifmcontentstoprint').contentWindow;
        let tableFood = "<table style=\"width:100%;text-align:center\"><tr><td style=\"width:33%;border:2px solid black;height:40px\"><b>T??n m??n ??n</b></td><td style=\"width:33%;border:2px solid black\"><b>Gi??/1 ph???n</b></td><td style=\"width:33%;border:2px solid black\"><b>S??? l?????ng</b></td></tr>";
        pri.document.open();
        pri.document.write(content.outerHTML);
        for (var i = 0; i < name.length; i++) {
            tableFood += "<tr > <td style=\"width:33%;border:1px solid black;height:70px\">" + name[i].innerHTML + "</td><td style=\"width:33%;border:1px solid black\">" + price[i].innerHTML + "</td> <td style=\"width:33%;border:1px solid black\">" + amount[i].innerHTML + "</td> </tr>"
        }
        pri.document.write(tableFood + "</table>")
        pri.document.write("<div style=\" padding-top:20px;font-size:24px\">" + totalBill.innerHTML + "</div>");
        pri.document.close();
        pri.focus();
        pri.print();
    }
    function handleDateCom(date) {
        try {
            if (date == null) {
                return (<span style={{ color: 'red', fontWeight: 'bold', fontSize: 13 }}>Ch??a thanh to??n</span>);
            } else {
                return date;
            }
        } catch (error) {
        }
    }

    const ModalCustomer = () => {
        return (
            <Modal
                show={showModalCustomer}
                onHide={handleCloseModalCustomer}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Th??ng tin kh??ch </Modal.Title>
                </Modal.Header>
                <Row className="Rbill">
                    <span> <b>T??n kh??ch h??ng :</b> {inforCustomer.HoTen} </span>
                </Row>
                <Row className="Rbill">
                    <span> <b>Email :</b> {inforCustomer.Email} </span>
                </Row>
                <Modal.Footer>
                    <Button variant="primary"
                        onClick={() => {
                            if (varTempShowCustomer == false) {
                                handleCloseModalCustomer();
                                handleShowModal();
                            } else {
                                handleCloseModalCustomer();
                                setVarTempShowCustomer(false);
                            }
                        }}>
                        ????ng
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    const ModalOrder = () => {
        return (
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>M?? h??a ????n {dataItem.MaHD}</Modal.Title>
                </Modal.Header>
                <iframe id="ifmcontentstoprint" style={{
                    height: '0px',
                    width: '0px',
                    position: 'absolute'
                }}></iframe>
                <Modal.Body >
                    <div id="printarea">
                        <Row className="Rbill">
                            <span> <b>Th???i gian ?????t :</b> {dataItem.Date} </span>
                        </Row>
                        <Row className="Rbill">
                            <span> <b>Kh??ch h??ng :</b> {dataItem.Customer}  <a> <BsQuestionSquare onClick={() => getCustomer(dataItem.Customer)} /></a> </span>
                        </Row>
                        <Row className="Rbill">
                            <span> <b>Th???i gian thanh to??n :</b> {handleDateCom(dataItem.DateCom)} </span>
                        </Row>
                        <Row className="Rbill">
                            <span> <b>In h??a ????n </b> <AiOutlinePrinter onClick={() => handlePrintBill()} /> </span>
                        </Row>
                        <Row className="Rbill">
                            <span> <b>Chi ti???t h??a ????n</b> </span>
                        </Row>
                    </div>
                    <Row style={{ width: '100%' }} sm={12}  >
                        {elements}
                    </Row>
                    <div id="totalBill">
                        <Row style={{ paddingRight: 30 }} className="justify-content-end" sm={12}>
                            <b>T???ng ti???n : </b> {getPriceVND(dataItem.TongTien) + "??"}
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        ????ng
                    </Button>
                    <Button onClick={() => { handleShow(); handleCloseModal() }} variant="danger" disabled={dataItem.Status == 1}>X??c nh???n thanh to??n</Button>
                </Modal.Footer>
            </Modal>
        )
    };
    const ModalPayment = () => {
        return (
            <Modal
                show={showPayment}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thanh to??n </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    B???n c?? ch???c ch???n kh??ch h??ng ???? thanh to??n h??a ????n n??y ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        ????ng
                    </Button>
                    <Button variant="danger" onClick={() => HandlePayment()}>Ch???c ch???n</Button>
                </Modal.Footer>
            </Modal>
        )
    };
    const ModalDelivery = () => {
        return (
            <Modal
                show={showDelivery}
                onHide={handleCloseDelivery}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>X??c nh???n ????n ???? giao th??nh c??ng? </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    B???n c?? ch???c ch???n kh??ch h??ng ???? nh???n ???????c ????n?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseDelivery}>
                        ????ng
                    </Button>
                    <Button variant="danger" onClick={() => HandleDelivery()}>Ch???c ch???n</Button>
                </Modal.Footer>
            </Modal>
        )
    };
    const ModalDelete = () => {
        return (
            <Modal
                show={deletePayment}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}

            >
                <Modal.Header closeButton>
                    <Modal.Title>Xo?? ????n h??ng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    B???n c?? ch???c ch???n xo?? ????n h??ng n??y?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        ????ng
                    </Button>
                    <Button variant="danger" onClick={() => DeletePayment()}>Ch???c ch???n</Button>
                </Modal.Footer>
            </Modal>
        )
    };



    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 30, width: '100%' }}>
            <Row className="justify-content-between" style={{ paddingBottom: 30 }}>
                <span ><h4>T???t c??? ????n h??ng</h4></span>
                <Form className="d-flex">
                    <FormControl
                        type="search"
                        placeholder="T??m ki???m theo m?? h??a ????n ..."
                        className="mr-2"
                        aria-label="Search"
                        onChange={(value) => { updateSearch(value) }}
                    />
                    <Button style={{ width: 150 }} variant="outline-danger">T??m ki???m</Button>
                </Form>
            </Row>
            <Card className="cardd" style={{ width: '100%' }}>
                <table className="tablehoadon">
                    <tr className="trhoadon">
                        <td>STT</td>
                        <td>M?? h??a ????n</td>

                        <td>ID Kh??ch h??ng</td>
                        <td>T???ng ti???n</td>
                        <td>Th???i gian ?????t</td>
                        <td>Ng??y thanh to??n</td>
                        <td>T??nh tr???ng</td>
                        <td>X??? l??</td>


                    </tr>
                    {rows.map((row, index) => (
                        <tr className="trDetails" key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.MaHD}</td>

                            <td><a onClick={() => { handleShowModalCustomer(); getCustomer(row.Customer); setVarTempShowCustomer(true) }}>{row.Customer} <BsQuestionSquare className="qs" /> </a></td>
                            <td>{getPriceVND(row.TongTien) + " ??"}</td>
                            <td>{row.Date}</td>
                            <td>{handleDateCom(row.DateCom)}</td>
                            <td>{setIconStatus(row.Status)}</td>

                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle} className="navbar-toggle" id="dropdown-basic" variant="light" bsPrefix>
                                        <BsThreeDots className="bacham" size={18} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        <Dropdown.Header>????n h??ng {row.MaHD}</Dropdown.Header>
                                        <Dropdown.Item onClick={() => { setShowDelivery(true); setIdhoadon(row.MaHD) }} href="#" disabled={row.Status == 2}>
                                            Giao th??nh c??ng
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setShowPayment(true); setIdhoadon(row.MaHD) }} href="#" disabled={row.Status == 1}>
                                            X??c nh???n thanh to??n
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setDataItem(row); handleFood(row.MangFood) }} href="#">
                                            Xem chi ti???t
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setDeletePayment(true); setIdhoadon(row.MaHD) }} href="#">
                                            X??a ????n
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                            </td>

                        </tr>
                    ))}
                </table>
            </Card>

            {ModalPayment()}
            {ModalOrder()}
            {ModalCustomer()}
            {ModalDelete()}
            {ModalDelivery()}
        </div>
    )
}