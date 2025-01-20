import { Breadcrumbs, Link } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { decode, encode } from '../../../utils/functions/HashString';

const BreadcrumbCustom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const path = searchParams.get('folder');
  const decodedPath = decode(path ?? '');
  const splitPathWithUid = `${decodedPath}`?.split('/root');
  const uid = splitPathWithUid?.[0]?.includes('/') ? null! : splitPathWithUid?.[0];
  const pathLists = splitPathWithUid?.[1] ? `root${splitPathWithUid?.[1]}`?.split('/') : !uid ? decodedPath.split('/') : ['root'];
  const breadcrumbs = pathLists?.map((item, index) => {
    const slicedPath = pathLists.slice(0, index + 1);
    const newPath = slicedPath.join('/');
    return (
      <Link
        key={index + 1}
        color={index !== pathLists.length - 1 ? 'inherit' : 'primary'}
        sx={{ cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}
        onClick={() => (newPath !== 'root' ? setSearchParams(`?folder=${encode(uid ? uid + newPath : newPath)}`) : setSearchParams(''))}
      >
        {item}
      </Link>
    );
  });
  return <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>{breadcrumbs}</Breadcrumbs>;
};
export default BreadcrumbCustom;
