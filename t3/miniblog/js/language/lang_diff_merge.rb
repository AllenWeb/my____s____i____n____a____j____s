#! /usr/bin/ruby

FS = "\n"
if RUBY_PLATFORM.downcase.include?("mswin")
  FS = "\r\n"
end 

#比较简体和繁体文本差异，自动列出未翻译的key:value映射列表,交给香港同事翻译。
#@param lang_js :"client_msg.js" or "msg.js"
def diff(lang_js)
  file_zh = open(File.join(File.dirname(__FILE__),"zh",lang_js))
  file_tw = open(File.join(File.dirname(__FILE__),"zh-tw",lang_js));
  
  lines_zh = file_zh.readlines
  lines_tw = file_tw.readlines

  map_zh = _mapping(lines_zh)
  map_tw = _mapping(lines_tw)
  
  arr = []
  
  map_zh.keys.sort.each do |k|
    if not map_tw[k]
      puts k + " 还没有翻译,对应简体文案为　" + map_zh[k]
      arr.push(k + " : " + map_zh[k] + FS)
    end
  end
  
  result = open("diffed" + Time.new.strftime("_%Y_%m_%d_") + lang_js,"w")
  result.puts(arr.join(""))
end

#把新翻译的繁体文本与现有繁体文本增量合并，合并结果到新文件中（人肉检查后可替换原繁体文本）。
#@param new_tw_js 新翻译的繁体文本
#@param current_tw_js :现有繁体文本("client_msg.js" or "msg.js")
def merge(new_tw_js,current_tw_js)
  file_tw_new = open(File.join(File.dirname(__FILE__),new_tw_js))
  file_tw_current = open(File.join(File.dirname(__FILE__),"zh-tw",current_tw_js));
  
  lines_tw_new = file_tw_new.readlines
  lines_tw_current = file_tw_current.readlines

  map_tw_new = _mapping(lines_tw_new)
  map_tw_current = _mapping(lines_tw_current)
  
  map = map_tw_current.merge(map_tw_new)
  arr = []
  
  map.keys.sort.each do |k|
    puts "合并　"+ k + " : " + map[k]
    arr.push(k + " : " + map[k] + FS)
  end
  
  result = open("merged" + Time.new.strftime("_%Y_%m_%d_") + current_tw_js,"w")
  result.puts(arr.join(""))
end

def _mapping(arr)
  map = {}
  arr.each  do |line|
      if line.split(":").length>=2 #　一行中可能有多个":"符号
          line = line.strip()
          index = line.index(":")
          map[line[0,index].strip()] = line[index+1,line.size-1].strip()
      end
  end
  return map
end

#just for Test 
if __FILE__ == $0
  diff("client_msg.js")
  diff("msg.js")
  #merge("new_translated_tw_client_msg.js","client_msg.js")
end