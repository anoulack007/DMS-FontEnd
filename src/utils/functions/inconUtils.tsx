
import FoldeImage from "../../assets/Image/image 11.png";
import ZipImage from "../../assets/logo/zip_ic.svg";
import PngImage from "../../assets/logo/png.svg";
import DocsImage from "../../assets/logo/doc_ic.svg";
import XlsxImage from "../../assets/logo/excel_ic.svg";
import ImageImage from "../../assets/logo/image_ic.svg";
import JpegImage from "../../assets/logo/jpg.svg.svg";
import PptImage from "../../assets/logo/ptt_ic.svg";
import Mp3Image from "../../assets/logo/music_ic.svg";
import VideoImage from "../../assets/logo/video_ic.svg";
import PdfImage from "../../assets/logo/pdf_ic.svg";
import TxtImage from "../../assets/logo/txt.svg.svg";
import SvgImage from "../../assets/logo/svg.svg.svg";
import ExeImage from "../../assets/logo/exe.svg.svg";
import RarImage from "../../assets/logo/rar_ic.svg";
import Jpeg from "../../assets/logo/jpeg.png";
import Python from "../../assets/logo/python_ic.svg";
import Html from "../../assets/logo/html-icon.svg";
import Js from "../../assets/logo/javascript_icon.svg";
import HeicImage from "../../assets/logo/heic.png";
import { IconType } from "../../enums/icon-enums";


export const getIconByType = (type: string) => {
  switch (type) {
    case IconType.FOLDER:
      return <img src={FoldeImage} alt="folder" />;
    case IconType.ZIP:
      return <img src={ZipImage} alt="zip" />;
    case IconType.PNG:
      return <img height={45} src={PngImage} alt="png" />;
    case IconType.DOCX:
      return <img src={DocsImage} alt="docx" />;
    case IconType.XLSX:
      return <img src={XlsxImage} alt="xlsx" />;
    case IconType.IMAGE:
      return <img src={ImageImage} alt="image" />;
    case IconType.JPG:
      return <img height={45} src={JpegImage} alt="jpeg" />;
    case IconType.PPT:
      return <img src={PptImage} alt="ppt" />;
    case IconType.MP3:
      return <img src={Mp3Image} alt="mp3" />;
    case IconType.MP4:
      return <img src={VideoImage} alt="video" />;
    case IconType.PDF:
      return <img src={PdfImage} alt="pdf" />;
    case IconType.TXT:
      return <img height={45} src={TxtImage} alt="txt" />;
    case IconType.SVG:
      return <img height={45} src={SvgImage} alt="svg" />;
    case IconType.EXE:
      return <img height={45} src={ExeImage} alt="exe" />;
    case IconType.RAR:
      return <img height={45} src={RarImage} alt="rar" />;
    case IconType.JPEG:
      return <img height={45} src={Jpeg} alt="jpeg" />;
    case IconType.PYTHON:
      return <img height={45} src={Python} alt="python" />;
    case IconType.HTML:
      return <img height={45} src={Html} alt="html" />;
    case IconType.JS:
      return <img height={45} src={Js} alt="Javascript" />;
    case IconType.HEIC:
      return <img height={45} src={HeicImage} alt="Heic" />;
    default:
      return <img src={FoldeImage} alt="folder" />;
  }
};