
export const smartPunctuationPairs = [
    {
      from: /[\u2018\u2019]/g,
      to: "'"
    },
    {
      from: /[\u2018\u2019]/g,
      to: "'"
    }
  ]

export const replaceSmartPunctuation = (str: string) => {
    // if (!_.isString(str)) {
    //   return str
    // }
  
    smartPunctuationPairs.forEach(pair => {
      str = str.replace(pair.from, pair.to)
    })
  
    return str
  }
  