import "./charInfo.scss";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const updateChar = () => {
    const { charId } = props;

    if (!charId) {
      return;
    }
    
    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const skeleton = char || loading || error ? null : <Skeleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;

  let imgStyle = { objectFit: "cover" };
  if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
    imgStyle = { objectFit: "contain" };
  }

  let comicsItem = comics.map((item, i) => {
    if (i > 9) return;
    return (
      <li className="char__comics-item" key={i}>
        <a href={item.resourceURI}>{item.name}</a>
      </li>
    );
  });

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={imgStyle} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">Homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">{comics.length < 1 ? "There is no comics with this character" : comicsItem}</ul>
    </>
  );
};
export default CharInfo;
