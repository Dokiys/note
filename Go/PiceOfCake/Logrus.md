# Logrus

`logrus`提供了结构化的日志输出，并且完全兼容标准库的`log`:

```go
func TestLogrus(t *testing.T) {
	logrus.SetFormatter(&logrus.JSONFormatter{})

	log := logrus.New()		// 实例
	log.SetFormatter(&logrus.TextFormatter{
		ForceColors: true,
	})
  // 输出中添加自定义字段
	logger := log.WithFields(logrus.Fields{
		"user_id": 10010,
		"ip":      "192.168.32.15",
	})

	logrus.Infof("test: %s", "Hello Work!")
	logger.Infof("test: %s", "Hello Work!")
}
```

```bash
INFO[0000] test: Hello Work!                             ip=192.168.32.15 user_id=10010
{"level":"info","msg":"test: Hello Work!","time":"2021-09-16T13:47:49+08:00"}
```

通过实例还可以指定日志的输出：

```go
func TestOut(t *testing.T) {
	log := logrus.New()
	log.SetFormatter(&logrus.JSONFormatter{})
	// The API for setting attributes is a little different than the package level
	// exported logger. See Godoc.
	//log.Out = os.Stdout

	// You could set this to any `io.Writer` such as a file
	file, err := os.OpenFile("logrus.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err == nil {
		log.Out = file
	} else {
		log.Error("Failed to log to file, using default stderr")
	}

	log.Info("Hello File Log")
}
```

