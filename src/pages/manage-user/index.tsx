import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { renderEmail } from './cell-renderers/email';
import { renderAvatar } from './cell-renderers/avartar';
import { randomColor, randomPhoneNumber, randomEmail } from '@mui/x-data-grid-generator';

import { Paper, Box, IconButton, Menu, MenuItem, Typography, Toolbar, InputBase,Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Checkbox,
  Chip,
  TableSortLabel,
  Drawer,
  FormControlLabel,
  TablePagination } from '@mui/material';

import image from '../../assets/avatar.svg'

//icons
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


const columns: GridColDef[] = [
  {
    field: 'avatar',
    headerName: 'Avatar',
    display: 'flex',
    renderCell: renderAvatar,
    valueGetter: (value, row) =>
      row.name == null || row.avatar == null
        ? null
        : { name: row.name, color: row.avatar },
    sortable: false,
    filterable: false,
  } as GridColDef<any, { color: string; name: string }>,
  { field: 'id', headerName: 'User ID', width: 150 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
  {
    field: 'email',
    headerName: 'Email',
    renderCell: renderEmail,
    width: 200,
  },
  {
    field: 'role', headerName: 'Role', width: 150,
  },
  {
    field: 'company',
    headerName: 'Companry',
    width: 150,
  }, {
    field: 'action',
    headerName: 'Action',
    width: 150,
    
  }

];




const paginationModel = { page: 0, pageSize: 5 };



export default function DataTable() {
  const [auth, setAuth] = React.useState(true); 
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // RowPerPage
  const [page, setPage] = React.useState(0); // Page

//ChangeTablePage
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

//ChangeRowsPerPage
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  

//profile
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

//checkbox
    const [DataTableTest] = React.useState<RowData[]>(initialRows);
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) => {
        if (prev.includes(id)) {
            return prev.filter((prevId) => prevId !== id);
        } else {
            return [...prev, id];
        }
    });
};


  return (

    <Box>

      <Box sx={{ flexGrow: 1, bgcolor: 'white', width: '100%', height: 74, borderRadius: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          {auth && (
            <div style={{ marginTop: 10 }}>
              admin-1
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <img src={image} alt="image   " />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </Box>


      <Box sx={{ flexGrow: 1, width: '100%', height: 89 }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#838383', marginTop: 1 }}>
          User management
            <div style={{fontSize: 14, color: '#838383'}}>User management</div>
          </Typography>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, borderRadius: 6, marginTop: 3 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
            />

            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            
          </Paper>
        </Toolbar>
      </Box>

      
      <TableContainer component={Paper} sx={{ height: 400, width: '100%', marginBottom: 10}}>
        <table aria-label='simple table'>
          <TableHead>
            <TableRow>
            <TableCell padding="checkbox">
                <Checkbox
                  icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                  checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                  checked={selectedIds.length === DataTableTest.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < DataTableTest.length}
                  onChange={() => {
                    if (selectedIds.length === DataTableTest.length) {
                        setSelectedIds([]);
                    } else {
                        setSelectedIds(DataTableTest.map(row => row.id));
                    }
                }}

                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
              <TableRow
                key={row.id}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell padding="checkbox" >
                    <Checkbox
                      icon={<PanoramaFishEyeIcon sx={{ color: "gray" }} />}
                      checkedIcon={<CheckCircleIcon sx={{ color: "blue" }} />}
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone_number}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.company}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </table>
      </TableContainer>
      <TablePagination
        component="div"
        count={initialRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
        
        

    </Box>

  );
}

interface RowData {
  id: number;
  name: string;
  phone_number: String;
  email: string;
  role: String;
  company: String;
}

const initialRows: RowData[] = [
  {
  "id": 1,
  "name": "Geno Alldre",
  "phone_number": "908-377-5557",
  "email": "galldre0@prlog.org",
  "role": "Construction Worker",
  "company": "Avaveo"
}, {
  "id": 2,
  "name": "Charity MacMaykin",
  "phone_number": "896-614-9949",
  "email": "cmacmaykin1@t.co",
  "role": "Construction Worker",
  "company": "Skimia"
}, {
  "id": 3,
  "name": "Janeta Haylett",
  "phone_number": "791-496-8106",
  "email": "jhaylett2@berkeley.edu",
  "role": "Construction Manager",
  "company": "Innotype"
}, {
  "id": 4,
  "name": "Monroe Cullagh",
  "phone_number": "628-150-8622",
  "email": "mcullagh3@ebay.co.uk",
  "role": "Electrician",
  "company": "Quimba"
}, {
  "id": 5,
  "name": "Maitilde Lievesley",
  "phone_number": "702-429-6559",
  "email": "mlievesley4@unesco.org",
  "role": "Electrician",
  "company": "Feedspan"
}, {
  "id": 6,
  "name": "Monique Barclay",
  "phone_number": "639-664-5203",
  "email": "mbarclay5@jalbum.net",
  "role": "Supervisor",
  "company": "Youbridge"
}, {
  "id": 7,
  "name": "Nicole Simmons",
  "phone_number": "306-235-3142",
  "email": "nsimmons6@digg.com",
  "role": "Project Manager",
  "company": "Gabspot"
}, {
  "id": 8,
  "name": "Hobard Joss",
  "phone_number": "185-635-7252",
  "email": "hjoss7@tiny.cc",
  "role": "Project Manager",
  "company": "Lajo"
}, {
  "id": 9,
  "name": "Cello Steabler",
  "phone_number": "925-654-8126",
  "email": "csteabler8@omniture.com",
  "role": "Subcontractor",
  "company": "Riffpath"
}, {
  "id": 10,
  "name": "Arri Gray",
  "phone_number": "172-104-4009",
  "email": "agray9@vk.com",
  "role": "Supervisor",
  "company": "Skalith"
}, {
  "id": 11,
  "name": "Filippo Kenealy",
  "phone_number": "111-505-5931",
  "email": "fkenealya@plala.or.jp",
  "role": "Surveyor",
  "company": "Avavee"
}, {
  "id": 12,
  "name": "Annamaria Ballard",
  "phone_number": "436-930-6912",
  "email": "aballardb@storify.com",
  "role": "Estimator",
  "company": "Ailane"
}, {
  "id": 13,
  "name": "Georgeanna Willson",
  "phone_number": "983-985-0582",
  "email": "gwillsonc@cbslocal.com",
  "role": "Construction Expeditor",
  "company": "Zoombeat"
}, {
  "id": 14,
  "name": "Jacquenette Dyble",
  "phone_number": "796-964-8707",
  "email": "jdybled@netvibes.com",
  "role": "Construction Worker",
  "company": "Skinder"
}, {
  "id": 15,
  "name": "Terrie Dunguy",
  "phone_number": "902-476-3801",
  "email": "tdunguye@istockphoto.com",
  "role": "Project Manager",
  "company": "Abata"
}, {
  "id": 16,
  "name": "Vivianne Pashley",
  "phone_number": "702-948-2108",
  "email": "vpashleyf@mail.ru",
  "role": "Construction Foreman",
  "company": "Demimbu"
}, {
  "id": 17,
  "name": "Tish Drakeford",
  "phone_number": "382-900-5554",
  "email": "tdrakefordg@addtoany.com",
  "role": "Estimator",
  "company": "Wordify"
}, {
  "id": 18,
  "name": "Donovan Albany",
  "phone_number": "669-846-9039",
  "email": "dalbanyh@bing.com",
  "role": "Electrician",
  "company": "Feednation"
}, {
  "id": 19,
  "name": "Wilburt Brik",
  "phone_number": "397-607-9596",
  "email": "wbriki@admin.ch",
  "role": "Project Manager",
  "company": "Edgeblab"
}, {
  "id": 20,
  "name": "Cindelyn Halcro",
  "phone_number": "656-785-9993",
  "email": "chalcroj@wikimedia.org",
  "role": "Subcontractor",
  "company": "Skinix"
}, {
  "id": 21,
  "name": "Mandi Sherwell",
  "phone_number": "363-739-7835",
  "email": "msherwellk@java.com",
  "role": "Construction Worker",
  "company": "Rhynoodle"
}, {
  "id": 22,
  "name": "Karole Cleall",
  "phone_number": "324-455-5698",
  "email": "kclealll@epa.gov",
  "role": "Electrician",
  "company": "Cogibox"
}, {
  "id": 23,
  "name": "Guido Poley",
  "phone_number": "387-649-1242",
  "email": "gpoleym@patch.com",
  "role": "Construction Foreman",
  "company": "Skimia"
}, {
  "id": 24,
  "name": "Edeline Ragot",
  "phone_number": "651-151-0744",
  "email": "eragotn@slate.com",
  "role": "Architect",
  "company": "Plajo"
}, {
  "id": 25,
  "name": "Arne Gresswood",
  "phone_number": "470-552-9133",
  "email": "agresswoodo@foxnews.com",
  "role": "Construction Manager",
  "company": "Flipopia"
}, {
  "id": 26,
  "name": "Junette MacKaig",
  "phone_number": "369-119-5297",
  "email": "jmackaigp@yolasite.com",
  "role": "Construction Expeditor",
  "company": "Skyble"
}, {
  "id": 27,
  "name": "Maurizio Robken",
  "phone_number": "691-724-5707",
  "email": "mrobkenq@indiatimes.com",
  "role": "Subcontractor",
  "company": "LiveZ"
}, {
  "id": 28,
  "name": "Jamil Kingswoode",
  "phone_number": "737-948-5161",
  "email": "jkingswooder@csmonitor.com",
  "role": "Construction Foreman",
  "company": "Mynte"
}, {
  "id": 29,
  "name": "Stella Muriel",
  "phone_number": "108-503-1162",
  "email": "smuriels@whitehouse.gov",
  "role": "Electrician",
  "company": "Yodo"
}, {
  "id": 30,
  "name": "Suzie Bythway",
  "phone_number": "826-192-0218",
  "email": "sbythwayt@theglobeandmail.com",
  "role": "Construction Worker",
  "company": "Wikizz"
}, {
  "id": 31,
  "name": "Luciana Baggiani",
  "phone_number": "968-711-8369",
  "email": "lbaggianiu@amazon.co.uk",
  "role": "Surveyor",
  "company": "Eimbee"
}, {
  "id": 32,
  "name": "Irma McCrea",
  "phone_number": "720-549-8346",
  "email": "imccreav@aboutads.info",
  "role": "Construction Manager",
  "company": "Flashdog"
}, {
  "id": 33,
  "name": "Tisha Assaf",
  "phone_number": "182-353-4303",
  "email": "tassafw@xrea.com",
  "role": "Subcontractor",
  "company": "Buzzdog"
}, {
  "id": 34,
  "name": "Minny Swainger",
  "phone_number": "140-561-4733",
  "email": "mswaingerx@google.nl",
  "role": "Supervisor",
  "company": "InnoZ"
}, {
  "id": 35,
  "name": "Teirtza Constable",
  "phone_number": "296-169-8058",
  "email": "tconstabley@paginegialle.it",
  "role": "Architect",
  "company": "Mynte"
}, {
  "id": 36,
  "name": "Odilia Jope",
  "phone_number": "757-922-5694",
  "email": "ojopez@netscape.com",
  "role": "Construction Foreman",
  "company": "Avamm"
}, {
  "id": 37,
  "name": "Bendite Allon",
  "phone_number": "291-267-7821",
  "email": "ballon10@webs.com",
  "role": "Engineer",
  "company": "Katz"
}, {
  "id": 38,
  "name": "Reggie Tynan",
  "phone_number": "575-713-2378",
  "email": "rtynan11@altervista.org",
  "role": "Engineer",
  "company": "Myworks"
}, {
  "id": 39,
  "name": "Moll Hansana",
  "phone_number": "295-582-1874",
  "email": "mhansana12@sohu.com",
  "role": "Engineer",
  "company": "Oba"
}, {
  "id": 40,
  "name": "Willem Haney`",
  "phone_number": "435-122-9777",
  "email": "whaney13@cdbaby.com",
  "role": "Construction Foreman",
  "company": "Youtags"
}, {
  "id": 41,
  "name": "Lina Cecil",
  "phone_number": "256-369-5904",
  "email": "lcecil14@telegraph.co.uk",
  "role": "Construction Foreman",
  "company": "Tanoodle"
}, {
  "id": 42,
  "name": "Marleah Rubenfeld",
  "phone_number": "919-574-8937",
  "email": "mrubenfeld15@mlb.com",
  "role": "Surveyor",
  "company": "Katz"
}, {
  "id": 43,
  "name": "Courtney Miettinen",
  "phone_number": "522-789-6145",
  "email": "cmiettinen16@wordpress.com",
  "role": "Construction Manager",
  "company": "Twimbo"
}, {
  "id": 44,
  "name": "Concordia Southard",
  "phone_number": "518-974-0260",
  "email": "csouthard17@reuters.com",
  "role": "Engineer",
  "company": "Snaptags"
}, {
  "id": 45,
  "name": "Cayla Hurd",
  "phone_number": "798-261-7417",
  "email": "churd18@aboutads.info",
  "role": "Construction Expeditor",
  "company": "Devpulse"
}, {
  "id": 46,
  "name": "Adelind Rilton",
  "phone_number": "874-667-6053",
  "email": "arilton19@aboutads.info",
  "role": "Supervisor",
  "company": "Realcube"
}, {
  "id": 47,
  "name": "Marj Wathall",
  "phone_number": "857-321-5991",
  "email": "mwathall1a@samsung.com",
  "role": "Estimator",
  "company": "Topicshots"
}, {
  "id": 48,
  "name": "Lovell Benyan",
  "phone_number": "254-317-7555",
  "email": "lbenyan1b@soundcloud.com",
  "role": "Subcontractor",
  "company": "Vinte"
}, {
  "id": 49,
  "name": "Simonette Jakobsson",
  "phone_number": "330-928-9097",
  "email": "sjakobsson1c@google.ru",
  "role": "Construction Expeditor",
  "company": "Fivespan"
}, {
  "id": 50,
  "name": "Lee Huntall",
  "phone_number": "407-998-1057",
  "email": "lhuntall1d@hubpages.com",
  "role": "Supervisor",
  "company": "Voomm"
}, {
  "id": 51,
  "name": "Seana Carress",
  "phone_number": "146-618-3105",
  "email": "scarress1e@irs.gov",
  "role": "Project Manager",
  "company": "Yotz"
}, {
  "id": 52,
  "name": "Thacher McKinty",
  "phone_number": "948-802-3660",
  "email": "tmckinty1f@rediff.com",
  "role": "Supervisor",
  "company": "Rhyloo"
}, {
  "id": 53,
  "name": "Frans Guilfoyle",
  "phone_number": "729-168-9530",
  "email": "fguilfoyle1g@bbc.co.uk",
  "role": "Project Manager",
  "company": "Bluejam"
}, {
  "id": 54,
  "name": "Drusy Cecere",
  "phone_number": "223-542-7060",
  "email": "dcecere1h@dropbox.com",
  "role": "Supervisor",
  "company": "Thoughtblab"
}, {
  "id": 55,
  "name": "Kippy Fifield",
  "phone_number": "161-143-3486",
  "email": "kfifield1i@people.com.cn",
  "role": "Surveyor",
  "company": "Livetube"
}, {
  "id": 56,
  "name": "Karissa Dobby",
  "phone_number": "194-253-5382",
  "email": "kdobby1j@amazon.co.uk",
  "role": "Construction Foreman",
  "company": "Dazzlesphere"
}, {
  "id": 57,
  "name": "Concettina Coupland",
  "phone_number": "920-417-4226",
  "email": "ccoupland1k@china.com.cn",
  "role": "Supervisor",
  "company": "Ntags"
}, {
  "id": 58,
  "name": "Valerye Blackstone",
  "phone_number": "425-997-8397",
  "email": "vblackstone1l@reference.com",
  "role": "Surveyor",
  "company": "Thoughtblab"
}, {
  "id": 59,
  "name": "Winona Tocknell",
  "phone_number": "739-579-7819",
  "email": "wtocknell1m@fotki.com",
  "role": "Estimator",
  "company": "Tambee"
}, {
  "id": 60,
  "name": "Hansiain Padden",
  "phone_number": "517-458-7546",
  "email": "hpadden1n@domainmarket.com",
  "role": "Project Manager",
  "company": "Flashpoint"
}, {
  "id": 61,
  "name": "Kevan Conichie",
  "phone_number": "975-497-6068",
  "email": "kconichie1o@princeton.edu",
  "role": "Engineer",
  "company": "Kamba"
}, {
  "id": 62,
  "name": "Stefa Hoodlass",
  "phone_number": "741-507-7728",
  "email": "shoodlass1p@narod.ru",
  "role": "Construction Worker",
  "company": "Yata"
}, {
  "id": 63,
  "name": "Aubrey Vallerine",
  "phone_number": "635-586-3256",
  "email": "avallerine1q@oakley.com",
  "role": "Surveyor",
  "company": "Divape"
}, {
  "id": 64,
  "name": "Cirilo Carletti",
  "phone_number": "715-482-1342",
  "email": "ccarletti1r@quantcast.com",
  "role": "Project Manager",
  "company": "Zoozzy"
}, {
  "id": 65,
  "name": "John Gudd",
  "phone_number": "879-160-1332",
  "email": "jgudd1s@youtu.be",
  "role": "Estimator",
  "company": "Skidoo"
}, {
  "id": 66,
  "name": "Cris Hriinchenko",
  "phone_number": "987-338-5338",
  "email": "chriinchenko1t@vistaprint.com",
  "role": "Project Manager",
  "company": "Kamba"
}, {
  "id": 67,
  "name": "Burgess Brise",
  "phone_number": "872-834-4453",
  "email": "bbrise1u@canalblog.com",
  "role": "Electrician",
  "company": "Layo"
}, {
  "id": 68,
  "name": "Silvano Baudacci",
  "phone_number": "284-128-1830",
  "email": "sbaudacci1v@biblegateway.com",
  "role": "Surveyor",
  "company": "Abatz"
}, {
  "id": 69,
  "name": "Juditha Whistan",
  "phone_number": "211-698-4588",
  "email": "jwhistan1w@geocities.jp",
  "role": "Surveyor",
  "company": "Pixonyx"
}, {
  "id": 70,
  "name": "Taddeusz Kment",
  "phone_number": "374-551-6461",
  "email": "tkment1x@eepurl.com",
  "role": "Architect",
  "company": "Skiba"
}, {
  "id": 71,
  "name": "Aurelea Thow",
  "phone_number": "101-497-2331",
  "email": "athow1y@ucoz.ru",
  "role": "Construction Foreman",
  "company": "Wikizz"
}, {
  "id": 72,
  "name": "Torrin Feehily",
  "phone_number": "966-818-4503",
  "email": "tfeehily1z@uiuc.edu",
  "role": "Construction Manager",
  "company": "BlogXS"
}, {
  "id": 73,
  "name": "Augie Stegers",
  "phone_number": "349-374-8348",
  "email": "astegers20@sbwire.com",
  "role": "Engineer",
  "company": "Skivee"
}, {
  "id": 74,
  "name": "Elfrida Cleobury",
  "phone_number": "350-141-2748",
  "email": "ecleobury21@answers.com",
  "role": "Architect",
  "company": "Dynabox"
}, {
  "id": 75,
  "name": "Westley Gniewosz",
  "phone_number": "351-714-7832",
  "email": "wgniewosz22@instagram.com",
  "role": "Supervisor",
  "company": "Voonder"
}, {
  "id": 76,
  "name": "Giorgia Flury",
  "phone_number": "444-917-2014",
  "email": "gflury23@g.co",
  "role": "Surveyor",
  "company": "Gabcube"
}, {
  "id": 77,
  "name": "Cornell Eyam",
  "phone_number": "796-946-1683",
  "email": "ceyam24@arstechnica.com",
  "role": "Electrician",
  "company": "Jaloo"
}, {
  "id": 78,
  "name": "Bob Samper",
  "phone_number": "702-549-7228",
  "email": "bsamper25@geocities.jp",
  "role": "Construction Worker",
  "company": "Livetube"
}, {
  "id": 79,
  "name": "Sarene Pugsley",
  "phone_number": "773-666-8840",
  "email": "spugsley26@domainmarket.com",
  "role": "Estimator",
  "company": "Babbleblab"
}, {
  "id": 80,
  "name": "Iris Cristea",
  "phone_number": "474-387-8600",
  "email": "icristea27@is.gd",
  "role": "Engineer",
  "company": "Brainbox"
}, {
  "id": 81,
  "name": "Augy Sach",
  "phone_number": "254-189-7779",
  "email": "asach28@addthis.com",
  "role": "Estimator",
  "company": "Lazz"
}, {
  "id": 82,
  "name": "Roanne Strowan",
  "phone_number": "586-843-4812",
  "email": "rstrowan29@skyrock.com",
  "role": "Construction Expeditor",
  "company": "Divape"
}, {
  "id": 83,
  "name": "Rafaellle Ledster",
  "phone_number": "335-289-6363",
  "email": "rledster2a@mayoclinic.com",
  "role": "Estimator",
  "company": "Skinte"
}, {
  "id": 84,
  "name": "Doreen Thow",
  "phone_number": "145-499-2297",
  "email": "dthow2b@ftc.gov",
  "role": "Construction Worker",
  "company": "Wordify"
}, {
  "id": 85,
  "name": "Aridatha Lightoller",
  "phone_number": "756-829-3418",
  "email": "alightoller2c@godaddy.com",
  "role": "Surveyor",
  "company": "Gabcube"
}, {
  "id": 86,
  "name": "Niki Easthope",
  "phone_number": "972-457-6376",
  "email": "neasthope2d@wikia.com",
  "role": "Project Manager",
  "company": "Vimbo"
}, {
  "id": 87,
  "name": "Berkie Dicte",
  "phone_number": "602-815-0655",
  "email": "bdicte2e@xing.com",
  "role": "Electrician",
  "company": "Fivechat"
}, {
  "id": 88,
  "name": "Janaye Moynihan",
  "phone_number": "647-195-8303",
  "email": "jmoynihan2f@163.com",
  "role": "Project Manager",
  "company": "Vinder"
}, {
  "id": 89,
  "name": "Jozef Gable",
  "phone_number": "453-441-0209",
  "email": "jgable2g@yahoo.com",
  "role": "Surveyor",
  "company": "Katz"
}, {
  "id": 90,
  "name": "Brandais Verzey",
  "phone_number": "555-111-5160",
  "email": "bverzey2h@desdev.cn",
  "role": "Supervisor",
  "company": "Thoughtmix"
}, {
  "id": 91,
  "name": "Vernor Lappine",
  "phone_number": "841-370-2201",
  "email": "vlappine2i@cloudflare.com",
  "role": "Construction Manager",
  "company": "Twiyo"
}, {
  "id": 92,
  "name": "Sena Breem",
  "phone_number": "849-192-5532",
  "email": "sbreem2j@yahoo.com",
  "role": "Construction Manager",
  "company": "Skalith"
}, {
  "id": 93,
  "name": "Teddie Swanson",
  "phone_number": "454-703-5417",
  "email": "tswanson2k@issuu.com",
  "role": "Supervisor",
  "company": "Babbleblab"
}, {
  "id": 94,
  "name": "Willa Shawyer",
  "phone_number": "293-848-2821",
  "email": "wshawyer2l@guardian.co.uk",
  "role": "Electrician",
  "company": "Linklinks"
}, {
  "id": 95,
  "name": "Donna Rossoni",
  "phone_number": "280-863-7077",
  "email": "drossoni2m@pinterest.com",
  "role": "Construction Expeditor",
  "company": "Jaxspan"
}, {
  "id": 96,
  "name": "Bat Strotton",
  "phone_number": "506-925-1550",
  "email": "bstrotton2n@huffingtonpost.com",
  "role": "Construction Foreman",
  "company": "Yodel"
}, {
  "id": 97,
  "name": "Leonora Aldwinckle",
  "phone_number": "657-932-7319",
  "email": "laldwinckle2o@purevolume.com",
  "role": "Construction Manager",
  "company": "Twiyo"
}, {
  "id": 98,
  "name": "Lorna O'Regan",
  "phone_number": "428-870-3255",
  "email": "loregan2p@sbwire.com",
  "role": "Project Manager",
  "company": "Brainlounge"
}, {
  "id": 99,
  "name": "Janeva McCaskill",
  "phone_number": "136-295-0607",
  "email": "jmccaskill2q@123-reg.co.uk",
  "role": "Engineer",
  "company": "Livetube"
}, {
  "id": 100,
  "name": "Michaelina Ughini",
  "phone_number": "779-857-6053",
  "email": "mughini2r@people.com.cn",
  "role": "Architect",
  "company": "Skipfire"
}]